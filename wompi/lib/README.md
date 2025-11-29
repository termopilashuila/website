# Wompi Payment Link Library

Python library for creating Wompi payment links.

## Installation

```bash
cd wompi
pip install -r requirements.txt
```

## Usage

### As a Script

Create payment links from input files:

```bash
# Process all JSON files in input/ directory
python lib/create_links.py

# Process a specific file
python lib/create_links.py input/params.json
```

### As a Library

Use the service in your own Python code:

```python
from lib.payment_link_service import WompiPaymentLinkService, load_env_credentials

# Load credentials from .env
private_key, public_key = load_env_credentials()

# Initialize service
service = WompiPaymentLinkService(private_key, public_key)

# Create a payment link
link_data = {
    "name": "Tour de Vino",
    "description": "Tour de vino y cacao",
    "single_use": False,
    "collect_shipping": False,
    "currency": "COP",
    "amount_in_cents": 15000000
}

# Validate before creating
errors = service.validate_link_data(link_data)
if errors:
    print("Validation errors:", errors)
else:
    # Create the link
    response = service.create_payment_link(link_data)
    print("Payment link created!")
    print("URL:", response["data"]["checkout_url"])
```

### Get Existing Payment Link

```python
# Retrieve link information
link_info = service.get_payment_link("3Z0Cfi")
print(link_info)
```

## API Reference

### WompiPaymentLinkService

#### `__init__(private_key: str, public_key: str)`
Initialize the service with Wompi credentials.

#### `create_payment_link(link_data: Dict[str, Any]) -> Dict[str, Any]`
Create a new payment link.

**Parameters:**
- `link_data`: Dictionary with payment link configuration

**Returns:**
- Dictionary with API response including `checkout_url`

**Raises:**
- `ValueError`: If required fields are missing
- `requests.exceptions.RequestException`: If API request fails

#### `get_payment_link(link_id: str) -> Dict[str, Any]`
Retrieve information about an existing payment link.

**Parameters:**
- `link_id`: The payment link ID

**Returns:**
- Dictionary with payment link information

#### `validate_link_data(link_data: Dict[str, Any]) -> List[str]`
Validate payment link data.

**Parameters:**
- `link_data`: Dictionary with payment link configuration

**Returns:**
- List of validation error messages (empty list if valid)

### Helper Functions

#### `load_env_credentials(env_path: Optional[str] = None) -> tuple`
Load Wompi credentials from .env file.

**Returns:**
- Tuple of `(private_key, public_key)`

## Payment Link Fields

### Required Fields
- `name` (string): Payment link name
- `description` (string): Payment description
- `single_use` (boolean): `true` for single use, `false` for multiple uses
- `collect_shipping` (boolean): Whether to collect shipping information

### Optional Fields
- `amount_in_cents` (integer): Amount in cents (null for open amount)
- `currency` (string): "COP" (default when amount is specified)
- `expires_at` (string): ISO 8601 date (e.g., "2025-12-31T23:59:59")
- `redirect_url` (string): URL to redirect after payment
- `image_url` (string): Image URL for payment page
- `sku` (string): Product SKU (max 36 chars)
- `customer_data` (object): Custom fields configuration
- `taxes` (array): Tax information

## Examples

See the `input/` directory for example JSON files and the `input/README.md` for detailed documentation on all available fields.

## Documentation

Official Wompi documentation:
https://docs.wompi.co/docs/colombia/links-de-pago/

