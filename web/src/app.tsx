import { Route, Routes, useParams } from "react-router-dom";

import { HomePage } from "./components/url-shortener/home-page";
import { NotFoundPage } from "./components/url-shortener/not-found-page";
import { RedirectPage } from "./components/url-shortener/redirect-page";

function RedirectRoute() {
    const { shortUrl = "" } = useParams();

    return <RedirectPage shortUrl={shortUrl} />;
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/:shortUrl" element={<RedirectRoute />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
