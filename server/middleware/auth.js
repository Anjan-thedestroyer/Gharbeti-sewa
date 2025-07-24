import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken || request.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                message: "Access token not provided",
                error: true,
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decoded || !decoded.id) {
            return response.status(403).json({
                message: "Invalid or malformed token",
                error: true,
                success: false
            });
        }

        request.userId = decoded.id;
        next();
    } catch (error) {
        console.error("JWT auth error:", error.message);

        return response.status(401).json({
            message: "Authentication failed",
            error: true,
            success: false
        });
    }
};

export default auth;
