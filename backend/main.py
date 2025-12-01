import os
import sys
import tempfile
import logging
from datetime import date
from typing import Optional, List, Any, Union
from decimal import Decimal

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import casparser
import pyxirr
import pandas as pd

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("TealScan")
logger.setLevel(logging.DEBUG)

app = FastAPI(title="TealScan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FundData(BaseModel):
    name: str
    category: str
    value: float
    invested: float
    plan_type: str
    xirr: Optional[float]
    xirr_status: str
    rating: str
    annual_commission_loss: float
    amc: str
    folio: str


class ScanResponse(BaseModel):
    net_worth: float
    total_invested: float
    total_gain: float
    total_gain_percent: float
    total_commission_loss: float
    portfolio_health_score: int
    funds_count: int
    direct_funds_count: int
    regular_funds_count: int
    asset_allocation: dict
    funds: List[FundData]


def to_float(value: Any) -> float:
    if value is None:
        return 0.0
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


def get_attr_or_key(obj: Any, key: str, default: Any = None) -> Any:
    if hasattr(obj, key):
        return getattr(obj, key, default)
    elif isinstance(obj, dict):
        return obj.get(key, default)
    return default


def classify_asset(scheme_name: str) -> str:
    name_upper = scheme_name.upper()
    if any(keyword in name_upper for keyword in ["LIQUID", "DEBT", "BOND", "OVERNIGHT", "MONEY MARKET", "GILT", "CORPORATE", "FIXED"]):
        return "Debt"
    elif any(keyword in name_upper for keyword in ["GOLD", "SILVER", "COMMODITY"]):
        return "Gold"
    else:
        return "Equity"


def detect_plan_type(scheme_name: str) -> str:
    name_upper = scheme_name.upper()
    if "DIRECT" in name_upper:
        return "Direct"
    else:
        return "Regular"


def calculate_health_rating(xirr_value: Optional[float]) -> str:
    if xirr_value is None:
        return "Unknown"
    xirr_percent = xirr_value * 100
    if xirr_percent > 20:
        return "In-Form"
    elif xirr_percent >= 12:
        return "On-Track"
    elif xirr_percent >= 0:
        return "Off-Track"
    else:
        return "Out-of-Form"


def calculate_xirr(transactions: list, current_value: float) -> tuple:
    if not transactions or current_value <= 0:
        return None, "No Data"
    
    dates = []
    amounts = []
    
    for txn in transactions:
        try:
            txn_date = get_attr_or_key(txn, "date")
            txn_type_val = get_attr_or_key(txn, "type", "")
            txn_type = str(txn_type_val).upper() if txn_type_val else ""
            txn_amount = to_float(get_attr_or_key(txn, "amount", 0))
            
            if txn_date is None or txn_amount == 0:
                continue
            
            if isinstance(txn_date, str):
                txn_date = pd.to_datetime(txn_date).date()
            
            if "REDEMPTION" in txn_type or "DIVIDEND" in txn_type:
                amounts.append(abs(txn_amount))
            else:
                amounts.append(-abs(txn_amount))
            
            dates.append(txn_date)
        except Exception:
            continue
    
    if not dates:
        return None, "No Transactions"
    
    dates.append(date.today())
    amounts.append(abs(current_value))
    
    try:
        xirr_value = pyxirr.xirr(dates, amounts)
        
        if xirr_value is None:
            return None, "Calculation Error"
        
        if abs(xirr_value) > 1.0:
            return None, "Partial Data"
        
        return xirr_value, "Complete"
    except Exception:
        return None, "Calculation Error"


def calculate_portfolio_health_score(funds: List[FundData]) -> int:
    if not funds:
        return 0
    
    total_value = sum(f.value for f in funds)
    if total_value == 0:
        return 0
    
    score = 0.0
    
    for fund in funds:
        weight = fund.value / total_value
        
        if fund.rating == "In-Form":
            fund_score = 100
        elif fund.rating == "On-Track":
            fund_score = 75
        elif fund.rating == "Off-Track":
            fund_score = 50
        elif fund.rating == "Out-of-Form":
            fund_score = 25
        else:
            fund_score = 50
        
        if fund.plan_type == "Regular":
            fund_score -= 10
        
        score += weight * fund_score
    
    return max(0, min(100, int(score)))


@app.get("/")
async def root():
    return {"message": "TealScan API is running", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/scan", response_model=ScanResponse)
async def scan_portfolio(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    logger.info("=== /api/scan endpoint called ===")
    logger.info(f"File details: name={file.filename}, content_type={file.content_type}")
    logger.debug(f"Password length: {len(password)}")
    
    filename = file.filename or ""
    if not filename.lower().endswith('.pdf'):
        logger.warning(f"Rejected non-PDF file: {filename}")
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    temp_file_path: Optional[str] = None
    try:
        logger.info("Creating temporary file for PDF processing...")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        logger.info(f"Temporary file created: {temp_file_path}, size: {len(content)} bytes")
        
        try:
            logger.info("Starting casparser.read_cas_pdf...")
            cas_data = casparser.read_cas_pdf(temp_file_path, password, force_pdfminer=True)
            logger.info("casparser.read_cas_pdf completed successfully")
            logger.debug(f"CAS data type: {type(cas_data)}")
        except Exception as e:
            logger.error(f"casparser failed with exception: {type(e).__name__}: {str(e)}")
            error_msg = str(e).lower()
            if "password" in error_msg or "decrypt" in error_msg:
                logger.warning("Password error detected")
                raise HTTPException(status_code=401, detail="Incorrect password for the PDF file")
            elif "pdf" in error_msg:
                logger.warning("Invalid PDF error detected")
                raise HTTPException(status_code=400, detail="Invalid or corrupted PDF file")
            else:
                logger.error(f"Unknown parsing error: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Error parsing CAS statement: {str(e)}")
        
        funds_list: List[FundData] = []
        total_value = 0.0
        total_invested = 0.0
        total_commission_loss = 0.0
        asset_allocation = {"Equity": 0.0, "Debt": 0.0, "Gold": 0.0}
        
        folios = get_attr_or_key(cas_data, "folios", [])
        if folios is None:
            folios = []
        
        for folio in folios:
            folio_number = str(get_attr_or_key(folio, "folio", "Unknown"))
            amc = str(get_attr_or_key(folio, "amc", "Unknown AMC"))
            schemes = get_attr_or_key(folio, "schemes", [])
            if schemes is None:
                schemes = []
            
            for scheme in schemes:
                scheme_name = str(get_attr_or_key(scheme, "scheme", "Unknown Scheme"))
                
                valuation = get_attr_or_key(scheme, "valuation", {})
                if valuation is None:
                    valuation = {}
                current_value = to_float(get_attr_or_key(valuation, "value", 0))
                
                if current_value <= 0:
                    continue
                
                transactions = get_attr_or_key(scheme, "transactions", [])
                if transactions is None:
                    transactions = []
                
                invested = 0.0
                for txn in transactions:
                    txn_type_val = get_attr_or_key(txn, "type", "")
                    txn_type = str(txn_type_val).upper() if txn_type_val else ""
                    txn_amount = to_float(get_attr_or_key(txn, "amount", 0))
                    if "REDEMPTION" not in txn_type and "DIVIDEND" not in txn_type:
                        invested += abs(txn_amount)
                    else:
                        invested -= abs(txn_amount)
                
                invested = max(0, invested)
                
                category = classify_asset(scheme_name)
                plan_type = detect_plan_type(scheme_name)
                
                xirr_value, xirr_status = calculate_xirr(transactions, current_value)
                
                rating = calculate_health_rating(xirr_value)
                
                annual_loss = current_value * 0.01 if plan_type == "Regular" else 0.0
                
                fund_data = FundData(
                    name=scheme_name,
                    category=category,
                    value=round(current_value, 2),
                    invested=round(invested, 2),
                    plan_type=plan_type,
                    xirr=round(xirr_value * 100, 2) if xirr_value is not None else None,
                    xirr_status=xirr_status,
                    rating=rating,
                    annual_commission_loss=round(annual_loss, 2),
                    amc=amc,
                    folio=folio_number
                )
                
                funds_list.append(fund_data)
                total_value += current_value
                total_invested += invested
                total_commission_loss += annual_loss
                asset_allocation[category] += current_value
        
        if not funds_list:
            raise HTTPException(status_code=400, detail="No valid fund data found in the CAS statement")
        
        total_gain = total_value - total_invested
        total_gain_percent = (total_gain / total_invested * 100) if total_invested > 0 else 0.0
        
        direct_count = sum(1 for f in funds_list if f.plan_type == "Direct")
        regular_count = sum(1 for f in funds_list if f.plan_type == "Regular")
        
        portfolio_health_score = calculate_portfolio_health_score(funds_list)
        
        asset_allocation_percent = {}
        for category, value in asset_allocation.items():
            asset_allocation_percent[category] = round((value / total_value * 100) if total_value > 0 else 0, 2)
        
        response = ScanResponse(
            net_worth=round(total_value, 2),
            total_invested=round(total_invested, 2),
            total_gain=round(total_gain, 2),
            total_gain_percent=round(total_gain_percent, 2),
            total_commission_loss=round(total_commission_loss, 2),
            portfolio_health_score=portfolio_health_score,
            funds_count=len(funds_list),
            direct_funds_count=direct_count,
            regular_funds_count=regular_count,
            asset_allocation=asset_allocation_percent,
            funds=funds_list
        )
        
        logger.info("=== /api/scan completed successfully ===")
        logger.info(f"Response summary: {len(funds_list)} funds, net_worth={round(total_value, 2)}")
        return response
    
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            logger.debug(f"Cleaning up temporary file: {temp_file_path}")
            os.unlink(temp_file_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
