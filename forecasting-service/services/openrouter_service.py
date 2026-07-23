import logging
import httpx
from config import OPENROUTER_API_KEY

logger = logging.getLogger("forecasting.openrouter")

async def generate_ai_forecast_explanation(territory_name, top_sku_name, total_predicted_val, growth_pct, scheme_name=None):
    """
    Calls OpenRouter LLM API to convert numerical predictions into plain-English executive summaries.
    Falls back to a structured rule-based explanation if OPENROUTER_API_KEY is not configured.
    """
    if OPENROUTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                prompt = (
                    f"You are an FMCG Demand Analyst for RetailConnect SIP. Explain the demand forecast in a detailed, professional 4-bullet-point executive summary for the Area Sales Manager.\n"
                    f"Context:\n"
                    f"- Territory: {territory_name}\n"
                    f"- Forecasted Monthly Demand: INR {total_predicted_val:,.2f} ({growth_pct:+.1f}% growth vs last month)\n"
                    f"- Primary Driver SKU: {top_sku_name}\n"
                    f"- Active Promotion: {scheme_name if scheme_name else 'Standard Trade Pricing'}\n\n"
                    f"Please include:\n"
                    f"1. A high-level revenue and growth projection.\n"
                    f"2. Insights on the top moving SKU and promotional impact.\n"
                    f"3. Operational risks (e.g. stockouts, supply chain bottlenecks).\n"
                    f"4. Actionable recommendations for Sales Officers' daily beat plans.\n\n"
                    f"CRITICAL: Do NOT use any markdown formatting (no asterisks, no bold text). Return plain text bullet points only."
                )

                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "HTTP-Referer": "https://retailconnect.app",
                        "X-Title": "RetailConnect SIP Forecasting",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "google/gemini-2.5-flash",
                        "messages": [
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": 400
                    }
                )

                if response.status_code == 200:
                    res_json = response.json()
                    ai_text = res_json['choices'][0]['message']['content'].strip()
                    logger.info("Successfully generated AI forecast explanation via OpenRouter")
                    return ai_text
        except Exception as e:
            logger.warning(f"OpenRouter API call failed ({e}). Using rule-based explanation.")

    # Rule-based intelligent fallback summary (More detailed)
    scheme_clause = f" supported by the active '{scheme_name}' promotion" if scheme_name else " driven by baseline organic demand"
    direction = "increase" if growth_pct >= 0 else "decrease"
    
    summary = (
        f"• Revenue Projection: {territory_name} demand is projected to {direction} by {abs(growth_pct):.1f}%, reaching a total of INR {total_predicted_val:,.2f} this period.\n"
        f"• Key Drivers: The primary volume driver is {top_sku_name},{scheme_clause}. Ensure distributors are pre-ordering sufficient safety stock for this SKU.\n"
        f"• Risk Assessment: Given the {abs(growth_pct):.1f}% variance from baseline, there is a moderate risk of out-of-stock (OOS) events at high-velocity retail outlets if replenishment cycles are delayed.\n"
        f"• Recommended Action: Sales Officers (SOs) should prioritize Tier-1 outlets on their daily beats and push secondary target allocations immediately to capitalize on the upward trend."
    )
    return summary
