import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin-painel",
          "/admin-painel/",
          "/agenda-painel",
          "/agenda-painel/",
          "/api/admin",
          "/api/admin/",
          "/data",
          "/data/"
        ]
      }
    ],
    sitemap: "https://entreasilhas.com.br/sitemap.xml"
  };
}
