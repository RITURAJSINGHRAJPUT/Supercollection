# Super Collection - Admin User Guide

Welcome to the **Super Collection Admin Dashboard**. This guide will help you understand and utilize all the features available in your management system to efficiently run your store.

---

## 1. Dashboard Overview
The **Dashboard** is your central hub for a quick glance at your store's performance.

- **Summary Cards**: At the top, view your Total Sales, Total Purchases, Total Products count, and Total Categories count.
- **Quick Links**: Use the "Add Sale" and "Add Product" buttons for fast access to your most common actions.
- **Sales & Purchases Chart**: Visual representation of your financial performance over the last 30 days.
- **Sales by Category**: A pie chart breaking down which categories are generating the most revenue.
- **Recent Sales**: A quick list of the last 5 transactions made.
- **Low Stock Alerts**: Automatically flags and displays up to 5 products that have 5 or fewer items remaining in stock.

---

## 2. Products Management
The **Products** page allows you to manage your entire inventory catalog.

- **Add Product**: Click "Add Product" to create a new entry. You will need to provide:
  - Product Name
  - Price (₹)
  - Stock Quantity
  - Category (selected from your existing categories)
  - Image URL (Supports Google Drive Links directly)
- **Edit/Delete**: Use the actions menu on the right of any product to update its details or remove it from the catalog.
- **Search**: Quickly find products by typing their name or category in the search bar.
- **Stock Visualization**: Stock levels are automatically color-coded:
  - **Green**: Healthy stock (> 10)
  - **Amber**: Low stock (1 - 10)
  - **Red**: Out of stock (0)

---

## 3. Categories
The **Categories** page is where you define the different product groups (e.g., Mobile Accessories, Chargers).

- **Add Category**: Simply click "Add Category" and provide a name.
- **Delete Category**: Remove existing categories. *(Note: Make sure no products are actively using a category before deleting it)*.

---

## 4. Sales Register
The **Sales** page handles all outgoing inventory and revenue generation.

- **Record New Sale**: Select a product, enter the quantity sold, and the selling price per unit. The system will automatically calculate the total amount.
- **Inventory Sync**: Recording a sale *automatically deducts* the sold quantity from your product's stock.
- **Negative Inventory Warning**: If you try to sell more items than you have in stock, the system will warn you before allowing negative inventory.
- **Delete Sale**: If you make a mistake, you can delete a sale record. Deleting a sale will *automatically restore* that quantity back to the product's stock.

---

## 5. Purchase Register
The **Purchases** page is for recording incoming stock from suppliers (restocking).

- **Record New Purchase**: Select a product, enter the quantity purchased, and the cost price per unit.
- **Inventory Sync**: Recording a purchase *automatically adds* the purchased quantity to your product's stock.
- **Delete Purchase**: If you made an error adding a purchase, deleting the record will *automatically deduct* that quantity from the product's stock.

---

## 6. Analytics & Reports
The **Analytics** page provides deep insights into your business metrics.

- **Daily & Monthly Performance**: Detailed charts showing revenue and costs daily (last 30 days) and monthly (last 12 months).
- **Revenue by Category**: See which product groups are the most profitable.
- **Top Selling Products**: A ranked list of your best-performing products based on total revenue and units sold.
- **Export to PDF**: Click the "Export PDF" button at the top right to generate a clean, professional PDF report of your current analytics for record-keeping or sharing.

---

## 7. Settings & Admin Tools
The **Settings** page contains advanced tools for data management.

### Data Export (Backups)
- **Export All as JSON**: Downloads a complete backup of everything (Products, Categories, Sales, Purchases). Keep this safe!
- **Export Sales as CSV**: Downloads a spreadsheet of all your sales data, which can be opened in Excel or Google Sheets.

### Danger Zone (Resets)
- **Clear Transactional Data**: This tool allows you to wipe all Sales and Purchases records to start fresh (e.g., for a new financial year or after testing). 
- *Note: This requires you to type "DELETE" to confirm. It will **not** delete your Products or Categories, and your current stock counts will remain exactly as they are.*
