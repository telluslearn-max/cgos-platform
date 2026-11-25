import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "CGOS Catalogue - Product Management",
  description: "Commerce Growth OS - Product catalogue management and intelligence",
};

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return {
      products: products.map((p) => ({
        ...p,
        sellingPrice: Number(p.sellingPrice),
        costPrice: p.costPrice ? Number(p.costPrice) : null,
      })),
      isLiveDb: true,
    };
  } catch (error) {
    console.error("Error loading catalogue products:", error);
    return {
      products: [],
      isLiveDb: false,
    };
  }
}

export default async function CataloguePage() {
  const { products, isLiveDb } = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 antialiased pb-16">
      <GlobalNav currentPath="/catalogue" />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header / Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Live Catalogue Overview</h3>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} products loaded from database.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {isLiveDb ? "Database Connected" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">SKU</th>
                    <th className="px-6 py-3 font-semibold">Stock</th>
                    <th className="px-6 py-3 font-semibold">Selling Price</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.brand}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.category || "-"}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{item.sku || "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            item.stockQuantity > 10
                              ? "bg-green-100 text-green-800"
                              : item.stockQuantity > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        KES {item.sellingPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 uppercase">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-gray-900">No products found in catalogue</h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                Run <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-mono">npm run seed</code> to populate the database with pilot products for NURU Electronics.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
