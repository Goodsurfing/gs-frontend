// Проверка живости для Traefik/мониторинга — без обращения к API
export const dynamic = "force-static";

export function GET() {
    return Response.json({ status: "ok", service: "web" });
}
