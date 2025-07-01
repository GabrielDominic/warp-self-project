import {withAuth} from "next-auth/middleware";
import { signIn } from "next-auth/react";

export default withAuth({
    pages: {
        signIn: "/"
    }
});

export const config = {
    matcher: [
        "/users/:path*",
        "/conversations/:path*",
    ]
};