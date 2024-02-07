import React from "react";

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }
    return (
        <>
            <div className="pagination-area mt-20 mb-20">
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className="page-item">
                            <a className="page-link"><i className="fi-rs-arrow-small-left" /></a>
                        </li>
                        {
                            pages.map((page, index) => {
                                return (
                                    <>
                                        <li className={page == currentPage ? "page-item active" : "page-item"} key={index} onClick={() => setCurrentPage(page)}>
                                            <a className="page-link" >
                                                {page}
                                            </a>
                                        </li>
                                    </>
                                );
                            })
                        }
                        <li className="page-item">
                            <a className="page-link"><i className="fi-rs-arrow-small-right"/></a>
                        </li>
                    </ul>
                </nav>
            </div>

        </>
    );
};

export default Pagination;