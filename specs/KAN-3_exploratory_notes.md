# KAN-3 Exploratory Testing Notes

## Scope
- Swagger URL: http://eaapi.somee.com/swagger/index.html
- API definition: GraphQLProductApp v1 (OAS3)

## Endpoint Discovery (from Swagger UI)
- POST /api/Authenticate/Login
- GET /api/Authenticate/Get
- GET /Components/GetComponentByProductId/{id}
- GET /Components/GetComponentsByProductId/{id}
- POST /Components/CreateComponent
- GET /Components/GetAllComponents
- GET /Product/GetProductById/{id}
- GET /Product/GetProductByIdAndName
- GET /Product/GetProductByName/{name}
- GET /Product/GetProducts
- POST /Product/Create
- POST /Product

## Request/Response Observations
- Login request body contains `userName` and `password`.
- Components and product endpoints expose list and item retrieval patterns by ID/name.
- Response schema includes nested product/components structures.

## Notes for Automation
- Start with smoke assertions on status and response shape.
- Add negative checks for high invalid IDs and missing login fields.
- Keep assertions resilient: accept 4xx family for negative tests where API behavior may vary.
