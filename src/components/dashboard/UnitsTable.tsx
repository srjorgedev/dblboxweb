import { useState, useEffect } from "react";
import type { PartialMeta, UnitData } from "../../types/unit.types";
import type { Lang } from "../../types/lang.types";
import { getAllUnits } from "../../hooks/getAllUnits";

interface Props {
    lang: Lang;
};

export default function UnitsTable({ lang }: Props) {
    const [data, setData] = useState<UnitData[]>([]);
    const [meta, setMeta] = useState<PartialMeta | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setErr(null);
            try {
                const { data, meta } = await getAllUnits(lang, "history", page, limit);
                setData(data);
                setMeta(meta);
            } catch (error: any) {
                setErr(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [lang, page, limit]);

    if (err) return <article style={{ padding: '2rem', color: '#ff8a80', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>Error: {err}</article>;

    return (
        <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s ease', position: 'relative' }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.5)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    pointerEvents: 'none'
                }}>
                    Actualizando...
                </div>
            )}
            <article className="controls" style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                alignItems: 'center',
                color: '#e0e0e0',
                background: '#1e1e1e',
                borderRadius: '8px',
                border: '1px solid #333',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}>
                <div className="limit-selector" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                    <label>Show:</label>
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#000', color: '#fff' }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className="pagination" style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', border: '1px solid #444', cursor: page === 1 ? 'not-allowed' : 'pointer', background: page === 1 ? '#111' : '#000', color: page === 1 ? '#555' : '#fff' }}
                    >
                        Prev
                    </button>
                    <span>Page <strong>{page}</strong> of {meta?.totalPages || 1}</span>
                    <button
                        disabled={!meta?.hasNextPage}
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', border: '1px solid #444', cursor: !meta?.hasNextPage ? 'not-allowed' : 'pointer', background: !meta?.hasNextPage ? '#111' : '#000', color: !meta?.hasNextPage ? '#555' : '#fff' }}
                    >
                        Next
                    </button>
                </div>
            </article>

            <div className="table-container" style={{
                background: '#1e1e1e',
                borderRadius: '8px',
                border: '1px solid #333',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}>
                <table className="unit-table">
                    <thead className="head">
                        <tr>
                            <th><span>Nombre</span></th>
                            <th><span>Color</span></th>
                            <th><span>Rareza</span></th>
                            <th><span>Capitulo</span></th>
                            <th><span>Tags</span></th>
                        </tr>
                    </thead>
                    <tbody className="body">
                        {
                            data && data.map((unit) => {
                                let name;

                                if (unit.name.count == 1) name = unit.name.content[0]
                                if (unit.name.count == 2 && unit.tagswitch) name = unit.name.content.join(" & ")
                                if (unit.name.count == 2 && unit.transform) name = unit.name.content.join(" → ")
                                if (unit.name.count == 3) name = `${unit.name.content[0]} & ${unit.name.content[1]} → ${unit.name.content[2]}`

                                return (
                                    <tr key={unit._id} className="unit-row" data-num={unit.num} data-id={unit._id} onClick={() => window.location.href = `/${lang}/dashboard/unit/${unit._id}`}>
                                        <td className="name"><span>{name}</span></td>
                                        <td className="colors">
                                            {unit.color.content.map((color) =>
                                                <span data-color={color.id} className={`unit-color ${color.id}`}>{color.name}</span>
                                            )}
                                        </td>
                                        <td className="rarity"><span>{unit.rarity.name}</span></td>
                                        <td className="chapter"><span>{unit.chapter.name}</span></td>
                                        <td className="tags"><span>{unit.tags.content[0].name}</span> <span>+{unit.tags.count - 1}</span></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}