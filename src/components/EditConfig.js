import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import CustomError from "./CustomError";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Variables from "./Variables";

const EditConfig = () => {

  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  const token = localStorage.getItem("token");

  const [option, setOption] = useState([]);
  const [selected, setSelected] = useState();
  const [price, setPrice] = useState();


  const [error, setError] = useState();
  const [show, setShow] = useState(false);
  const [invaliddata, setInvaliddata] = useState(false);

  const handleClose = () => {
    setShow(!show);
  }

  const handleInvalid = () => {
    setInvaliddata(false);
  }


  // Getting Options
  const G_Options = () => {
    axios.post(`${Variables.hostId}/${splitedIds[0]}/allroomtype`)
      .then(data => {
        console.log(data.data.suiteType);
        setOption(data.data);
      })
  }

  // Process Data in a server!
  const processData = () => {
    console.log(selected);
    const credentials = {
      suitetype: selected,
      price: price
    }
    axios.post(`${Variables.hostId}/${splitedIds[0]}/edittypedata`, credentials)
      .then(res => {
        {
          if (res.data.success) {
            setError(res.data);
            setShow(true);
            setPrice("");
          } else {
            setInvaliddata(true)
          }
        }
      })
    console.log(price);

  }

  //Loading Data!

  useEffect(() => {
    G_Options();
  }, [])

  useEffect(() => {
    setTimeout(handleInvalid, 4000)
  }, [invaliddata])



  return (
    <div>
      {
        token ? (
          <div>
            <div>
              <Navbar id={id} name={splitedIds[1]} />
            </div>
            <div className="align-down">
              <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                <div className='row text-center'>
                  <div className='col'>
                    {
                      invaliddata ? (

                        <Alert show={invaliddata}>
                          <div className="container text-center">
                            That's a bad input!
                          </div>
                        </Alert>
                      ) : (
                        <div>
                        </div>
                      )
                    }
                    <div class="card text-center" style={{ width: "50vh" }}>
                      <div class="card-header" style={{ color: "black" }}>
                        Configure Settings - Feautured
                      </div>
                      <div class="card-body">
                        <div className='modal-gap'>
                          <label style={{ color: "black" }}> Suite Type </label>
                          <select class="form-select" aria-label="Default select example" onChange={(e) => setSelected(e.target.value)}>
                            {
                              option.map((item, key) => {
                                return (
                                  <option>{item.suiteType}</option>
                                )
                              })
                            }
                          </select>
                        </div>
                        <div className='modal-gap'>
                          <label style={{ color: "black" }}> Suite Type </label>
                          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Suite Type" value={selected} />
                        </div>
                        <div className='modal-gap'>
                          <label style={{ color: "black" }}> Price </label>
                          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Price Per Day!' onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <br />
                        <button className='btn btn-info' onClick={processData}> Edit Data </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
              error == undefined ? (
                <div>
                </div>
              ) : (
                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Body className="text-center">
                      {error.message}!
                    </Modal.Body>
                  </Modal.Header>
                </Modal>
              )
            }
          </div>
        ) : (
          <CustomError />
        )
      }
    </div>
  )
}

export default EditConfig;