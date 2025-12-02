#!/usr/bin/env python3
"""
Script to create Wompi payment links from input files.

Usage:
    python create_links.py [input_file.json]
    
If no input file is specified, it will process all JSON files in the input/ directory.
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

from payment_link_service import WompiPaymentLinkService, load_env_credentials


def load_input_file(file_path: Path) -> List[Dict[str, Any]]:
    """
    Load payment link definitions from a JSON input file.
    
    Args:
        file_path: Path to the JSON input file
        
    Returns:
        List of payment link definitions
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Handle both single object and array of objects
    if isinstance(data, dict):
        return [data]
    elif isinstance(data, list):
        return data
    else:
        raise ValueError("Input file must contain a JSON object or array of objects")


def save_results(results: List[Dict[str, Any]], output_file: Path):
    """
    Save payment link creation results to a JSON file.
    
    Args:
        results: List of result dictionaries
        output_file: Path to the output file
    """
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Results saved to: {output_file}")


def create_links_from_file(service: WompiPaymentLinkService, input_file: Path) -> List[Dict[str, Any]]:
    """
    Create payment links from an input file.
    
    Args:
        service: WompiPaymentLinkService instance
        input_file: Path to the input JSON file
        
    Returns:
        List of results for each payment link creation attempt
    """
    print(f"\n📄 Processing: {input_file.name}")
    print("-" * 60)
    
    try:
        link_definitions = load_input_file(input_file)
    except Exception as e:
        print(f"✗ Error loading file: {e}")
        return [{
            "input_file": str(input_file),
            "error": f"Failed to load input file: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }]
    
    results = []
    
    for i, link_data in enumerate(link_definitions, 1):
        print(f"\n[{i}/{len(link_definitions)}] Creating link: {link_data.get('name', 'Unnamed')}")
        
        result = {
            "input_file": str(input_file),
            "link_number": i,
            "timestamp": datetime.now().isoformat(),
            "input_data": link_data
        }
        
        # Validate the link data
        errors = service.validate_link_data(link_data)
        if errors:
            print(f"✗ Validation errors:")
            for error in errors:
                print(f"  - {error}")
            result["status"] = "validation_error"
            result["errors"] = errors
            results.append(result)
            continue
        
        # Create the payment link
        try:
            response = service.create_payment_link(link_data)
            
            if "data" in response:
                link_id = response["data"]["id"]
                checkout_url = response["data"]["checkout_url"]
                
                print(f"✓ Success!")
                print(f"  ID: {link_id}")
                print(f"  URL: {checkout_url}")
                
                result["status"] = "success"
                result["link_id"] = link_id
                result["checkout_url"] = checkout_url
                result["response"] = response
            else:
                print(f"✗ Unexpected response format")
                result["status"] = "error"
                result["error"] = "Unexpected response format"
                result["response"] = response
        
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            result["status"] = "error"
            result["error"] = str(e)
        
        results.append(result)
    
    return results


def main():
    """Main function to process input files and create payment links."""
    
    # Get the base directory (wompi/)
    base_dir = Path(__file__).parent.parent
    input_dir = base_dir / "input"
    data_dir = base_dir / "data"
    
    print("=" * 60)
    print("Wompi Payment Link Creator")
    print("=" * 60)
    
    # Load credentials
    try:
        private_key, public_key = load_env_credentials()
        print(f"✓ Credentials loaded")
        print(f"  Public Key: {public_key[:20]}...")
    except Exception as e:
        print(f"✗ Error loading credentials: {e}")
        sys.exit(1)
    
    # Initialize service
    service = WompiPaymentLinkService(private_key, public_key)
    
    # Determine which files to process
    if len(sys.argv) > 1:
        # Process specific file
        input_file = Path(sys.argv[1])
        if not input_file.exists():
            print(f"✗ Error: File not found: {input_file}")
            sys.exit(1)
        input_files = [input_file]
    else:
        # Process all JSON files in input directory
        if not input_dir.exists():
            print(f"✗ Error: Input directory not found: {input_dir}")
            print(f"  Please create the directory and add JSON input files.")
            sys.exit(1)
        
        input_files = sorted(input_dir.glob("*.json"))
        
        if not input_files:
            print(f"✗ Error: No JSON files found in: {input_dir}")
            sys.exit(1)
    
    print(f"✓ Found {len(input_files)} input file(s)")
    
    # Process each file
    all_results = []
    for input_file in input_files:
        results = create_links_from_file(service, input_file)
        all_results.extend(results)
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = data_dir / f"payment_links_{timestamp}.json"
    save_results(all_results, output_file)
    
    # Print summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    
    success_count = sum(1 for r in all_results if r.get("status") == "success")
    error_count = sum(1 for r in all_results if r.get("status") == "error")
    validation_error_count = sum(1 for r in all_results if r.get("status") == "validation_error")
    
    print(f"Total processed: {len(all_results)}")
    print(f"✓ Successful: {success_count}")
    print(f"✗ Errors: {error_count}")
    print(f"✗ Validation errors: {validation_error_count}")
    
    # Print all successful URLs
    if success_count > 0:
        print("\n📎 Generated Payment Links:")
        print("-" * 60)
        for result in all_results:
            if result.get("status") == "success":
                name = result.get("input_data", {}).get("name", "Unnamed")
                print(f"{name}")
                print(f"  {result['checkout_url']}")
                print()


if __name__ == "__main__":
    main()



