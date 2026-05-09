const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const frontendUrl = import.meta.env.VITE_FRONTEND_URL?.trim();

function removeTrailingSlash(value: string) {
    return value.replace(/\/+$/, "");
}

export const env = {
    backendUrl: backendUrl ? removeTrailingSlash(backendUrl) : "",
    frontendUrl: frontendUrl ? removeTrailingSlash(frontendUrl) : "",
};

