export async function POST(request: Request) {
    const body = await request.json();

    // Mock login - in real app this would validate against users service
    return Response.json({
        token: 'demo-jwt-token-' + Date.now(),
        user: {
            id: '1',
            email: body.email,
            name: 'Food Lover'
        }
    });
}
