"use client";

import React, { useMemo, useState } from "react";
import { FiArrowUp, FiArrowDown, FiChevronDown } from "react-icons/fi";
import Button from "../Button/Button";
import Skeleton from "../Skeleton/Skeleton";
import "./Table.scss";

/**
 * Table — sortable, paginated data table using the enterprise
 * "financial instrument" row recipe (hairline dividers, right-aligned
 * tabular numerals, hover-reveal sort carets).
 *
 *  columns: [{ key, header, align, sortable, width, mono, render, sortAccessor }]
 *  data:    array of row objects
 *  rowKey:  (row, i) => key
 *  pageSize: number (0 = no pagination)
 */
export default function Table({
  columns = [],
  data = [],
  rowKey,
  pageSize = 0,
  loading = false,
  emptyState,
  onRowClick,
  stickyHeader = true,
  className = "",
}) {
  const [sort, setSort] = useState({ key: null, dir: null });
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort.key || !sort.dir) return data;
    const col = columns.find((c) => c.key === sort.key);
    const accessor = col?.sortAccessor || ((row) => row[sort.key]);
    const arr = [...data].sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return va - vb;
      return String(va).localeCompare(String(vb), undefined, { numeric: true });
    });
    return sort.dir === "desc" ? arr.reverse() : arr;
  }, [data, sort, columns]);

  const totalPages = pageSize ? Math.ceil(sorted.length / pageSize) : 1;
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const rows = pageSize
    ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : sorted;

  const toggleSort = (col) => {
    if (!col.sortable) return;
    setSort((s) => {
      if (s.key !== col.key) return { key: col.key, dir: "asc" };
      if (s.dir === "asc") return { key: col.key, dir: "desc" };
      return { key: null, dir: null };
    });
  };

  const showEmpty = !loading && rows.length === 0;

  return (
    <div className={`rc-table-wrap ${className}`.trim()}>
      <div className="rc-table-scroll">
        <table className="rc-table">
          <thead className={stickyHeader ? "is-sticky" : ""}>
            <tr>
              {columns.map((col) => {
                const isSorted = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width, textAlign: col.align || "left" }}
                    className={`${col.sortable ? "is-sortable" : ""} ${
                      isSorted ? "is-sorted" : ""
                    }`}
                    aria-sort={
                      isSorted
                        ? sort.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    onClick={() => toggleSort(col)}
                  >
                    <span className="rc-table__th">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="rc-table__sort" aria-hidden="true">
                          {isSorted ? (
                            sort.dir === "asc" ? (
                              <FiArrowUp />
                            ) : (
                              <FiArrowDown />
                            )
                          ) : (
                            <FiChevronDown />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: pageSize || 5 }).map((_, r) => (
                  <tr key={r} className="rc-table__skeleton-row">
                    {columns.map((col) => (
                      <td key={col.key} style={{ textAlign: col.align }}>
                        <Skeleton
                          variant="text"
                          width={col.align === "right" ? "50%" : "72%"}
                          style={
                            col.align === "right"
                              ? { marginLeft: "auto" }
                              : undefined
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row, i) => (
                  <tr
                    key={rowKey ? rowKey(row, i) : i}
                    className={onRowClick ? "is-clickable" : ""}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => e.key === "Enter" && onRowClick(row)
                        : undefined
                    }
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ textAlign: col.align || "left" }}
                        className={col.mono ? "rc-table__num" : ""}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showEmpty && (
        <div className="rc-table__empty">
          {emptyState || (
            <p className="rc-table__empty-text">No records to display.</p>
          )}
        </div>
      )}

      {pageSize > 0 && !showEmpty && (
        <div className="rc-table__footer">
          <span className="rc-table__count">
            {loading
              ? "Loading…"
              : `${safePage * pageSize + 1}–${Math.min(
                  (safePage + 1) * pageSize,
                  sorted.length
                )} of ${sorted.length}`}
          </span>
          <div className="rc-table__pager">
            <Button
              size="sm"
              variant="secondary"
              disabled={safePage === 0 || loading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <span className="rc-table__page-ind">
              Page {safePage + 1} / {totalPages || 1}
            </span>
            <Button
              size="sm"
              variant="secondary"
              disabled={safePage >= totalPages - 1 || loading}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
