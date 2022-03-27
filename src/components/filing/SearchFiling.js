import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import './Filing.css';

function SearchFiling() {

    const [showFilingSection, setShowFilingSection] = useState(false);
    const [showFiled, setShowFiled] = useState(false);
    const [showNotFiled, setShowNotFiled] = useState(false);

    const onClickFiled = () => {
        setShowFiled(true);
        setShowNotFiled(false);
    }
    const onClickNotFiled = () => {
        setShowFiled(false);
        setShowNotFiled(true);
    }
    const searchFilings = () => {
        setShowFilingSection(true);
        onClickFiled();
    }
    return (
        <div className='container p-4 filing-container text-center'>
            <div className='row mb-2'>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className='nav-link' to="/filing">View All Filings</NavLink>
                </div>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className='nav-link' to="/filing/search">Search Filing</NavLink>
                </div>
            </div>
            <h4 className='p-2'>Search for GST Filing</h4>
            <div className='row'>
                <div className='col-md-12 col-sm-12 mb-3'>
                    <input type="text" class="form-control" placeholder="Enter GST Number" />
                </div>
                <div className='col-sm-6 col-md-6 mb-3 mb-3'>
                    <div className='d-flex justify-content-between'>
                        <input type="date" className='form-control' />
                        <span>From Date</span>
                    </div>
                </div>
                <div className='col-sm-6 col-md-6 mb-3'>
                    <div className='d-flex justify-content-between'>
                        <input className='form-control' type="date" />
                        <span>To Date</span>
                    </div>
                </div>
                <div className='col-md-12 col-sm-12 d-grid'>
                    <button onClick={() => { searchFilings() }} className='btn btn-primary'>Search</button>
                </div>
            </div>
            <div className='row m-2'>
                {showFilingSection ? <><div className='col-md-12 col-sm-12'>
                    <h4 className='p-2'>Overview of GST Filings</h4>
                </div>
                    <div className='col-sm-6 col-md-6 d-grid mb-3'>
                        <button onClick={() => { onClickFiled() }} type="button" className="btn btn-success">Show Filed</button>
                    </div>
                    <div className='col-sm-6 col-md-6 d-grid mb-3'>
                        <button onClick={() => { onClickNotFiled() }} type="button" className="btn btn-danger">Show Not Filed</button>
                    </div> </> : ""}

                {!showFiled && !showNotFiled ? "" : showFiled && !showNotFiled ?
                    <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                            <h4>GST Filed Status</h4>
                        </div>
                    </div>
                    :
                    <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                            <h4>GST Not Filed Status</h4>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchFiling