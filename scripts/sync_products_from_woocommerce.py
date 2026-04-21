#!/usr/bin/env python3
"""
Sync product catalog from WooCommerce to website HTML.

Fetches published products from WooCommerce REST API and generates HTML snippets
for the vinos and chocolates sections in catalogo.html. Updates prices, descriptions,
product links, and structured data (Schema.org JSON-LD).

Usage:
    python3 scripts/sync_products_from_woocommerce.py
    python3 scripts/sync_products_from_woocommerce.py --env-file /path/to/.env
    python3 scripts/sync_products_from_woocommerce.py --dry-run

Requires:
    - WooCommerce API credentials in .env (WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET)
    - clients/woocommerce Python client installed

Environment:
    Repository root: /home/camilo/Github/termopilashuila/website
    WooCommerce client: /home/camilo/Github/cecabrera/selfhost/clients/woocommerce
"""

import argparse
import os
import re
import sys
from pathlib import Path
from typing import Any
from datetime import datetime

REPO_ROOT = Path(__file__).parent.parent
CLIENT_PATH = Path("/home/camilo/Github/cecabrera/selfhost/clients/woocommerce")
sys.path.insert(0, str(CLIENT_PATH))

from src import WooCommerceClient

CATALOGO_HTML = REPO_ROOT / "catalogo.html"
STORE_URL = "https://tienda.termopilas.co"

PRODUCT_CATEGORIES = {
    "vinos": ["Vino F27", "Vino Rose", "Vino Cova"],
    "chocolates": ["Nibs de cacao", "Chocolatinas 70", "Chocolatinas 100"],
}


def slugify(name: str) -> str:
    """Generate URL-safe slug from product name."""
    slug = name.lower()
    slug = re.sub(r'[%\s]+', '-', slug)
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    return slug.strip('-')


def generate_product_card(product: dict[str, Any], category: str) -> str:
    """Generate HTML card for a single product."""
    name = product.get("name", "")
    price = int(float(product.get("price", 0) or 0))
    description = re.sub(r'<[^>]+>', '', product.get("short_description", "") or product.get("description", "")).strip()
    permalink = product.get("permalink", "")
    image = product.get("images", [{}])[0].get("src", "") if product.get("images") else ""

    # Convert absolute WooCommerce image URL to local asset path if possible
    # For now, use WooCommerce image URL as-is (hotlink)
    image_path = image or f"assets/images/catalog/{slugify(name)}.png"

    # Handle variant pricing (e.g., Nibs 100g vs 300g)
    price_display = f"${price:,} COP" if price else "Precio variable"

    # WhatsApp CTA text encoding
    whatsapp_text = f"Hola. Encontré el producto {name} en la sección de catálogo en Termópilas. Me gustaría ordenarlo por favor"
    whatsapp_utm = f"utm_source=website&utm_medium=page&utm_campaign=catalog&utm_content=product_{slugify(name)}"

    html = f'''                <article class="catalog-card">
                    <img src="{image_path}" alt="{name}" loading="lazy">
                    <div class="catalog-card-content">
                        <h3>{name}</h3>
                        <p class="catalog-price">{price_display}</p>
                        <p>{description}</p>
                        <div class="catalog-actions">
                            <a href="{permalink}" class="cta-button" target="_blank" rel="noopener">Comprar en Tienda</a>
                            <a href="whatsapp.html?{whatsapp_utm}&text={whatsapp_text}" class="cta-button cta-secondary" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Pedir</a>
                        </div>
                    </div>
                </article>'''
    return html


def generate_schema_item(product: dict[str, Any], position: int) -> dict[str, Any]:
    """Generate Schema.org Product JSON-LD item."""
    name = product.get("name", "")
    price = product.get("price", "0")
    description = re.sub(r'<[^>]+>', '', product.get("description", "") or product.get("short_description", "")).strip()
    image = product.get("images", [{}])[0].get("src", "") if product.get("images") else ""
    permalink = product.get("permalink", "")
    stock_status = product.get("stock_status", "outofstock")

    availability_map = {
        "instock": "https://schema.org/InStock",
        "outofstock": "https://schema.org/OutOfStock",
        "onbackorder": "https://schema.org/PreOrder",
    }

    return {
        "@type": "ListItem",
        "position": position,
        "item": {
            "@type": "Product",
            "name": name,
            "description": description,
            "image": image or f"https://termopilas.co/assets/images/catalog/{slugify(name)}.png",
            "brand": {
                "@type": "Organization",
                "name": "Finca Termópilas"
            },
            "offers": {
                "@type": "Offer",
                "url": permalink,
                "priceCurrency": "COP",
                "price": price,
                "availability": availability_map.get(stock_status, "https://schema.org/OutOfStock"),
                "itemCondition": "https://schema.org/NewCondition"
            }
        }
    }


def sync_products(client: WooCommerceClient, dry_run: bool = False) -> None:
    """Fetch WooCommerce products and update catalogo.html."""
    print("=" * 70)
    print("WOOCOMMERCE PRODUCT CATALOG SYNC")
    print("=" * 70)
    print()

    # Fetch all published products
    products = client.list_all_products(status='publish')
    print(f"✓ Fetched {len(products)} published products from WooCommerce")
    print()

    # Categorize products
    categorized_products = {"vinos": [], "chocolates": []}
    for product in products:
        name = product.get("name", "")
        for category, keywords in PRODUCT_CATEGORIES.items():
            if any(kw.lower() in name.lower() for kw in keywords):
                categorized_products[category].append(product)
                break

    print(f"  Vinos:      {len(categorized_products['vinos'])} products")
    print(f"  Chocolates: {len(categorized_products['chocolates'])} products")
    print()

    # Read current HTML
    if not CATALOGO_HTML.exists():
        print(f"✗ ERROR: {CATALOGO_HTML} not found")
        sys.exit(1)

    html_content = CATALOGO_HTML.read_text(encoding='utf-8')
    original_content = html_content

    # Generate new HTML sections
    vinos_html = "\n".join(generate_product_card(p, "vinos") for p in categorized_products["vinos"])
    chocolates_html = "\n".join(generate_product_card(p, "chocolates") for p in categorized_products["chocolates"])

    # Generate Schema.org JSON-LD
    schema_items = []
    position = 1
    for product in categorized_products["vinos"] + categorized_products["chocolates"]:
        schema_items.append(generate_schema_item(product, position))
        position += 1

    # Replace vinos section (between <section class="catalog-section" id="vinos"> and </section>)
    vinos_pattern = r'(<section class="catalog-section" id="vinos">.*?<div class="catalog-grid">)(.*?)(</div>\s*</section>)'
    vinos_replacement = f'\\1\n{vinos_html}\n            \\3'
    html_content = re.sub(vinos_pattern, vinos_replacement, html_content, flags=re.DOTALL)

    # Replace chocolates section
    chocolates_pattern = r'(<section class="catalog-section" id="chocolates">.*?<div class="catalog-grid">)(.*?)(</div>\s*</section>)'
    chocolates_replacement = f'\\1\n{chocolates_html}\n            \\3'
    html_content = re.sub(chocolates_pattern, chocolates_replacement, html_content, flags=re.DOTALL)

    # Replace Schema.org structured data
    import json
    schema_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": schema_items
    }, indent=4, ensure_ascii=False)

    schema_pattern = r'(<script type="application/ld\+json">\s*\{[^}]*"@type":\s*"ItemList".*?</script>)'
    schema_replacement = f'<script type="application/ld+json">\n    {schema_json}\n    </script>'
    html_content = re.sub(schema_pattern, schema_replacement, html_content, flags=re.DOTALL)

    if dry_run:
        print("✓ DRY RUN: Changes not written to disk")
        print()
        print("  Preview of vinos section:")
        print(vinos_html[:500] + "..." if len(vinos_html) > 500 else vinos_html)
        print()
        print("  Preview of chocolates section:")
        print(chocolates_html[:500] + "..." if len(chocolates_html) > 500 else chocolates_html)
        print()
        return

    # Write updated HTML
    if html_content == original_content:
        print("✓ No changes detected (products already in sync)")
    else:
        CATALOGO_HTML.write_text(html_content, encoding='utf-8')
        print(f"✓ Updated {CATALOGO_HTML}")
        print(f"  Generated: {len(schema_items)} Schema.org product items")

    print()
    print(f"Sync completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def main() -> int:
    parser = argparse.ArgumentParser(description='Sync WooCommerce products to website catalog')
    parser.add_argument('--env-file', help='Path to .env file with WooCommerce credentials')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without writing to disk')
    args = parser.parse_args()

    # Load environment variables
    from dotenv import load_dotenv
    if args.env_file:
        load_dotenv(args.env_file)
    else:
        # Try multiple locations for .env
        env_paths = [
            CLIENT_PATH / ".env",
            Path("/home/camilo/Github/cecabrera/selfhost/clients/woocommerce/.env"),
            Path("/home/camilo/Github/cecabrera/selfhost/projects/termopilas/woocommerce/client/.env"),
        ]
        for env_path in env_paths:
            if env_path.exists():
                load_dotenv(env_path)
                break

    try:
        client = WooCommerceClient()
        sync_products(client, dry_run=args.dry_run)
        return 0
    except Exception as e:
        print(f"✗ ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
