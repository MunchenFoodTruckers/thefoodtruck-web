export async function POST(request: Request) {
    const body = await request.json();

    // Mock registration - in real app this would call users service
    return Response.json({
        success: true,
        message: 'Account created successfully'
    });
}
