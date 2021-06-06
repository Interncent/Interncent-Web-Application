import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Internshipform from '../Homepage/Internshipform'
import FilterForm from '../Homepage/FilterForm'

export function InternshipCreate(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <button onClick={handleShow} className="float-bx">
        <i className="fa fa-plus"></i>
      </button>
      <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Fill internship Details</Modal.Title>
        </Modal.Header>
        <Modal.Body><Internshipform {...props}></Internshipform></Modal.Body>
      </Modal>
    </div>
  )
}


export function FilterInternships() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div id="top-bar">
        <button type="button" className="btn btn-default btn-circle btn-lg" onClick={handleShow}>
          <i className="fa fa-filter"></i>
        </button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter Internships</Modal.Title>
        </Modal.Header>
        <Modal.Body><FilterForm onHide={handleClose} ></FilterForm></Modal.Body>
      </Modal>
    </div>
  )
}