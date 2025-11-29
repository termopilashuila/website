# Wompi Credentials

## ⚠️ IMPORTANT: This directory contains sensitive credentials

The `.env` file in this directory contains your Wompi API credentials. **Never commit this file to Git!**

## File Structure

```
wompi/
├── .env              ← Your credentials (DO NOT COMMIT!)
├── README.md         ← This file (safe to commit)
├── requirements.txt  ← Python dependencies
├── lib/              ← Payment link service library
│   ├── payment_link_service.py
│   ├── create_links.py
│   └── README.md
├── input/            ← JSON files defining payment links to create
│   ├── example_*.json
│   └── README.md
└── data/             ← Generated payment link data (with timestamps)
    └── payment_links_*.json
```

## .env File Format

```bash
PUBLIC_KEY=
PRIVATE_KEY=
EVENTS_SECRET=
INTEGRITY_SECRET=
```

## Credential Usage

| Credential | Where Used | Safe to Expose? | Purpose |
|------------|------------|-----------------|---------|
| `PUBLIC_KEY` | `tour.html` (client-side) | ✅ Yes | Identifies your Wompi account in widget |
| `INTEGRITY_SECRET` | Google Apps Script (server) | ❌ No | Generates payment signatures |
| `PRIVATE_KEY` | Server-side only | ❌ No | API authentication (future use) |
| `EVENTS_SECRET` | Server-side webhooks | ❌ No | Validates webhook events (future use) |

## Security Checklist

- [x] `.env` file added to `.gitignore`
- [x] Only public key used in client-side code
- [x] Integrity secret kept server-side (Apps Script)
- [x] Private key never exposed
- [ ] (Future) Webhook verification with events secret

## Getting Your Credentials

1. Log in to [Wompi Dashboard](https://comercios.wompi.co/)
2. Navigate to: **Desarrolladores > Secretos para integración técnica**
3. Copy each credential to your `.env` file

## Environment Types

### Sandbox (Testing)
```bash
PUBLIC_KEY=pub_test_...
PRIVATE_KEY=prv_test_...
EVENTS_SECRET=test_events_...
INTEGRITY_SECRET=test_integrity_...
```

Use sandbox credentials during development and testing.

### Production (Live Payments)
```bash
PUBLIC_KEY=pub_prod_...
PRIVATE_KEY=prv_prod_...
EVENTS_SECRET=prod_events_...
INTEGRITY_SECRET=prod_integrity_...
```

Use production credentials only when ready for real transactions.

## What if credentials are exposed?

If you accidentally commit credentials to Git:

1. **Immediately rotate keys** in Wompi Dashboard
2. **Update all deployed services** with new keys:
   - `tour.html` (public key)
   - Google Apps Script (integrity secret)
3. **Remove from Git history:**
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # Contact repository admin if needed
   ```
4. **Verify** old keys are deactivated in Wompi Dashboard

## Payment Links Service

We've created a Python service to generate Wompi payment links programmatically using the API.

### Quick Start

1. **Install dependencies:**
   ```bash
   cd wompi
   pip install -r requirements.txt
   ```

2. **Create payment links:**
   ```bash
   # Process all JSON files in input/ directory
   python lib/create_links.py
   
   # Or process a specific file
   python lib/create_links.py input/my_links.json
   
   # Process a file with multiple payment links
   python lib/create_links.py input/params.json
   ```

3. **Check results:**
   Generated links will be saved in `data/payment_links_TIMESTAMP.json`

### Multiple Links in One File

You can create multiple payment links from a single JSON file by providing an array of link definitions:

```json
[
  {
    "name": "Tour 1 persona",
    "description": "Tour para 1 persona",
    "amount_in_cop": 65000,
    "currency": "COP",
    "single_use": false,
    "collect_shipping": false
  },
  {
    "name": "Tour 2 personas",
    "description": "Tour para 2 personas",
    "amount_in_cop": 130000,
    "currency": "COP",
    "single_use": false,
    "collect_shipping": false
  }
]
```

The service will process each link definition in the array and create all payment links in a single batch operation. See `input/params.json` for a complete example.

**Note:** You can use either `amount_in_cop` (actual pesos) or `amount_in_cents` (cents). The service automatically converts `amount_in_cop` to cents for the API.

### Features

✅ **Create payment links** with various configurations:
- Fixed or open amounts
- Single-use or multi-use links
- Expiration dates
- Custom fields for collecting additional info
- Tax calculations (IVA/CONSUMPTION)
- Custom redirect URLs and images

✅ **Validation** before creating links
✅ **Batch processing** from JSON input files
✅ **Detailed logging** and error reporting

### Documentation

- [Payment Link Service API](lib/README.md)
- [Input File Format](input/README.md)
- [Wompi Payment Links Documentation](https://docs.wompi.co/docs/colombia/links-de-pago/)

### Example Usage in Python

```python
from lib.payment_link_service import WompiPaymentLinkService, load_env_credentials

# Load credentials
private_key, public_key = load_env_credentials()
service = WompiPaymentLinkService(private_key, public_key)

# Create a payment link (using amount_in_cop for convenience)
link_data = {
    "name": "Tour de Vino y Cacao",
    "description": "Tour completo con cata",
    "single_use": False,
    "collect_shipping": False,
    "currency": "COP",
    "amount_in_cop": 150000  # $150,000 COP
}

# Or use amount_in_cents directly
# "amount_in_cents": 15000000  # Same as 150,000 pesos

response = service.create_payment_link(link_data)
print(f"Payment link: {response['data']['checkout_url']}")
```

## Related Documentation

- [Wompi Integration Guide](../docs/wompi-integration.md)
- [Apps Script Deployment](../appscript/tour/README.md)
- [Security Best Practices](../docs/wompi-integration.md#security-best-practices-summary)
- [Payment Links Service](lib/README.md)

---

**Remember:** When in doubt, keep it secret! 🔒

