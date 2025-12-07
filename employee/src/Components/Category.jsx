import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

const Category = () => {
    const [category, setCategory] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/auth/category`)
        // axios.get(`http://localhost:4000/auth/category`)
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [])  // this array makes the component to render at once

    return (
        <div className='px-3 px-md-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Category-List</h3>
            </div>
            
            {/* Add Category Button */}
            <div className="d-flex justify-content-end mt-3">
                <Link className='btn btn-success' to="/dashboard/add-category">Add Category</Link>
            </div>

            <div className='mt-3'>
                {/* Table with responsiveness */}
                <div className="table-responsive">
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                category.map((c, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{c.name}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Category
