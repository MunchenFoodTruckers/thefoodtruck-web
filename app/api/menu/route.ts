export async function GET() {
    const menuConfig = {
        "menuItems": [
            {
                "id": "1",
                "name": "Classic Burger",
                "description": "Beef patty, lettuce, tomato, pickles, special sauce on brioche bun",
                "price": 8.99,
                "categoryId": "burgers",
                "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
                "available": true,
                "dietary": [],
                "popular": true,
                "calories": 650
            },
            {
                "id": "2",
                "name": "Veggie Burger",
                "description": "Plant-based patty, avocado, sprouts, vegan mayo",
                "price": 9.99,
                "categoryId": "burgers",
                "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["vegetarian", "vegan"],
                "popular": true,
                "calories": 520
            },
            {
                "id": "3",
                "name": "BBQ Bacon Burger",
                "description": "Double beef, crispy bacon, cheddar, BBQ sauce, onion rings",
                "price": 11.99,
                "categoryId": "burgers",
                "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop",
                "available": true,
                "dietary": [],
                "popular": false,
                "calories": 890
            },
            {
                "id": "4",
                "name": "Chicken Tacos",
                "description": "Grilled chicken, salsa verde, cilantro, lime (3 pcs)",
                "price": 7.99,
                "categoryId": "tacos",
                "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["gluten-free"],
                "popular": true,
                "calories": 420
            },
            {
                "id": "5",
                "name": "Beef Tacos",
                "description": "Seasoned beef, pico de gallo, sour cream, cheese (3 pcs)",
                "price": 8.49,
                "categoryId": "tacos",
                "image": "https://images.unsplash.com/photo-1599974041032-59ceaa9f8e9c?w=400&h=400&fit=crop",
                "available": true,
                "dietary": [],
                "popular": false,
                "calories": 540
            },
            {
                "id": "6",
                "name": "Crispy Fries",
                "description": "Golden french fries with sea salt",
                "price": 3.99,
                "categoryId": "sides",
                "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["vegan"],
                "popular": true,
                "calories": 380
            },
            {
                "id": "7",
                "name": "Onion Rings",
                "description": "Beer-battered onion rings with ranch dip",
                "price": 4.49,
                "categoryId": "sides",
                "image": "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["vegetarian"],
                "popular": false,
                "calories": 420
            },
            {
                "id": "8",
                "name": "Fresh Lemonade",
                "description": "House-made lemonade with mint",
                "price": 3.49,
                "categoryId": "drinks",
                "image": "https://images.unsplash.com/photo-1523677011781-c91d1bbe1e0c?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["vegan", "gluten-free"],
                "popular": true,
                "calories": 120
            },
            {
                "id": "9",
                "name": "Chocolate Brownie",
                "description": "Warm brownie with vanilla ice cream",
                "price": 5.99,
                "categoryId": "desserts",
                "image": "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["vegetarian"],
                "popular": true,
                "calories": 520
            },
            {
                "id": "10",
                "name": "Milkshake",
                "description": "Creamy vanilla milkshake with whipped cream",
                "price": 4.99,
                "categoryId": "drinks",
                "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop",
                "available": true,
                "dietary": ["vegetarian"],
                "popular": true,
                "calories": 450
            }
        ]
    };

    return Response.json(menuConfig.menuItems);
}
