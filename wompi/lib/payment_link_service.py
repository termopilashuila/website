"""
Wompi Payment Link Service

This service creates payment links using the Wompi API.
Documentation: https://docs.wompi.co/docs/colombia/links-de-pago/
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path


class WompiPaymentLinkService:
    """Service to create and manage Wompi payment links."""
    
    BASE_URL = "https://production.wompi.co/v1"
    CHECKOUT_BASE_URL = "https://checkout.wompi.co/l"
    
    def __init__(self, private_key: str, public_key: str):
        """
        Initialize the service with Wompi credentials.
        
        Args:
            private_key: Wompi private key for API authentication
            public_key: Wompi public key
        """
        self.private_key = private_key
        self.public_key = public_key
        self.headers = {
            "Authorization": f"Bearer {private_key}",
            "Content-Type": "application/json"
        }
    
    def create_payment_link(self, link_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a payment link using the Wompi API.
        
        Args:
            link_data: Dictionary containing payment link parameters
                      Can use either 'amount_in_cop' or 'amount_in_cents'
            
        Returns:
            Dictionary with the API response including link ID and URL
            
        Raises:
            requests.exceptions.RequestException: If the API request fails
        """
        endpoint = f"{self.BASE_URL}/payment_links"
        
        # Validate required fields
        required_fields = ["name", "description", "single_use", "collect_shipping"]
        for field in required_fields:
            if field not in link_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Make a copy to avoid modifying the original
        api_data = link_data.copy()
        
        # Convert amount_in_cop to amount_in_cents if present
        if "amount_in_cop" in api_data:
            api_data["amount_in_cents"] = int(api_data["amount_in_cop"] * 100)
            del api_data["amount_in_cop"]
        
        # Ensure currency is set (default to COP)
        if "amount_in_cents" in api_data and api_data["amount_in_cents"] is not None:
            api_data.setdefault("currency", "COP")
        
        # Make the API request
        response = requests.post(
            endpoint,
            headers=self.headers,
            json=api_data,
            timeout=30
        )
        
        # Raise exception if request failed
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        
        # Add the full checkout URL to the response
        if "data" in result and "id" in result["data"]:
            link_id = result["data"]["id"]
            result["data"]["checkout_url"] = f"{self.CHECKOUT_BASE_URL}/{link_id}"
        
        return result
    
    def get_payment_link(self, link_id: str) -> Dict[str, Any]:
        """
        Retrieve payment link information.
        
        Args:
            link_id: The payment link ID
            
        Returns:
            Dictionary with payment link information
        """
        endpoint = f"{self.BASE_URL}/payment_links/{link_id}"
        
        # This endpoint doesn't require authentication
        response = requests.get(endpoint, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        
        # Add the full checkout URL
        if "data" in result and "id" in result["data"]:
            result["data"]["checkout_url"] = f"{self.CHECKOUT_BASE_URL}/{link_id}"
        
        return result
    
    def validate_link_data(self, link_data: Dict[str, Any]) -> List[str]:
        """
        Validate payment link data and return list of errors.
        
        Args:
            link_data: Dictionary containing payment link parameters
            
        Returns:
            List of validation error messages (empty if valid)
        """
        errors = []
        
        # Check required fields
        required_fields = ["name", "description", "single_use", "collect_shipping"]
        for field in required_fields:
            if field not in link_data:
                errors.append(f"Missing required field: {field}")
        
        # Validate single_use is boolean
        if "single_use" in link_data and not isinstance(link_data["single_use"], bool):
            errors.append("Field 'single_use' must be a boolean")
        
        # Validate collect_shipping is boolean
        if "collect_shipping" in link_data and not isinstance(link_data["collect_shipping"], bool):
            errors.append("Field 'collect_shipping' must be a boolean")
        
        # Validate amount_in_cop if present (takes precedence)
        if "amount_in_cop" in link_data:
            if not isinstance(link_data["amount_in_cop"], (int, float)) or link_data["amount_in_cop"] <= 0:
                errors.append("Field 'amount_in_cop' must be a positive number")
        # Validate amount_in_cents if present (only if amount_in_cop not used)
        elif "amount_in_cents" in link_data and link_data["amount_in_cents"] is not None:
            if not isinstance(link_data["amount_in_cents"], int) or link_data["amount_in_cents"] <= 0:
                errors.append("Field 'amount_in_cents' must be a positive integer")
        
        # Validate currency if present
        if "currency" in link_data and link_data["currency"] != "COP":
            errors.append("Only 'COP' currency is supported")
        
        # Validate expires_at format if present
        if "expires_at" in link_data and link_data["expires_at"] is not None:
            try:
                datetime.fromisoformat(link_data["expires_at"].replace("Z", "+00:00"))
            except (ValueError, AttributeError):
                errors.append("Field 'expires_at' must be in ISO 8601 format (e.g., '2024-12-31T14:30:00')")
        
        # Validate customer_references if present
        if "customer_data" in link_data and "customer_references" in link_data["customer_data"]:
            refs = link_data["customer_data"]["customer_references"]
            if not isinstance(refs, list):
                errors.append("Field 'customer_references' must be a list")
            elif len(refs) > 2:
                errors.append("Maximum 2 customer_references allowed")
            else:
                for i, ref in enumerate(refs):
                    if "label" not in ref:
                        errors.append(f"customer_reference {i}: missing 'label' field")
                    elif len(ref["label"]) > 24:
                        errors.append(f"customer_reference {i}: 'label' must be max 24 characters")
                    if "is_required" not in ref:
                        errors.append(f"customer_reference {i}: missing 'is_required' field")
                    elif not isinstance(ref["is_required"], bool):
                        errors.append(f"customer_reference {i}: 'is_required' must be boolean")
        
        # Validate taxes if present
        if "taxes" in link_data:
            if not isinstance(link_data["taxes"], list):
                errors.append("Field 'taxes' must be a list")
            else:
                for i, tax in enumerate(link_data["taxes"]):
                    if "type" not in tax:
                        errors.append(f"tax {i}: missing 'type' field")
                    elif tax["type"] not in ["VAT", "CONSUMPTION"]:
                        errors.append(f"tax {i}: 'type' must be 'VAT' or 'CONSUMPTION'")
                    
                    # For fixed amount links, use amount_in_cents; for open amount, use percentage
                    has_amount = "amount_in_cents" in tax
                    has_percentage = "percentage" in tax
                    
                    if not has_amount and not has_percentage:
                        errors.append(f"tax {i}: must have either 'amount_in_cents' or 'percentage'")
        
        # Validate SKU length if present
        if "sku" in link_data and link_data["sku"] is not None:
            if len(link_data["sku"]) > 36:
                errors.append("Field 'sku' must be max 36 characters")
        
        return errors


def load_env_credentials(env_path: Optional[str] = None) -> tuple:
    """
    Load Wompi credentials from .env file.
    
    Args:
        env_path: Path to .env file (optional, defaults to wompi/.env)
        
    Returns:
        Tuple of (private_key, public_key)
    """
    from dotenv import load_dotenv
    
    if env_path:
        load_dotenv(env_path)
    else:
        # Try to find .env in wompi directory
        current_dir = Path(__file__).parent.parent
        env_file = current_dir / ".env"
        if env_file.exists():
            load_dotenv(env_file)
    
    private_key = os.getenv("PRIVATE_KEY")
    public_key = os.getenv("PUBLIC_KEY")
    
    if not private_key or not public_key:
        raise ValueError("PRIVATE_KEY and PUBLIC_KEY must be set in .env file")
    
    return private_key, public_key

