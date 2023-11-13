import React,{useState,useEffect} from "react";
import endpoints from "../../Endpoints/Endpoints";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { List } from 'react-content-loader'
import DataTable from 'react-data-table-component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactConfirmPopup from "react-confirm-popup";
import CustomToast from '../Toast/CustomToast';


function CertificatesModal({certificateId}) {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [downloading, setDownLoading] = useState(false);

    useEffect(() => {
    const endpoint =
      process.env.NODE_ENV === "production"
        ? endpoints.certificates.production+"/"+certificateId
        : endpoints.certificates.development+"/"+certificateId;
        setLoading(true)
        axios
        .get(endpoint)
        .then((response) => {
            setLoading(false);
            if (response.data.length > 0) {
                setData(response.data);
            } else {
                toast.error("No data found in the response.");
            }
        })
        .catch(() => {
          setLoading(false)
          toast.error("Error fetching qusetion");
        });
    }, [certificateId])

    const columns = [
        {
          name: 'Id',
          selector: (row) => row.id,
          sortable: true,
          searchable: true, 
        },
        {
          name: 'Name',
          selector: (row) => row.name,
          sortable: true,
          searchable: true,
        },
        {
            name: 'Download',
            cell: (row) => (
              <ReactConfirmPopup
                trigger={
                  <button
                    type="submit"
                    name="process"
                    className="btn btn-primary btn-sm"
                  >
                    {downloading ? "Downloading..." : (<><FontAwesomeIcon icon={faDownload} /> Download</>)}
                  </button>
                }
                title="Confirm downloading"
                text={<div>Are you sure you want to download this file?</div>}
                confirmText="Yes, I am sure"
                cancelText="No"
                onConfirmClicked={() => handleConfirmClicked(row.id,row.name)}
                onCancelClicked={handleCancelClicked}
              />
            ),
          },
      ];

      const paginationOptions = {
        rowsPerPageText: 'Rows per page:',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };

    const handleConfirmClicked = (id,name) => {
        const endpoint =
        process.env.NODE_ENV === "production"
          ? endpoints.download.production+"/"+id
          : endpoints.download.development+"/"+id;
          setDownLoading(true)
          axios
          .get(endpoint)
          .then((response) => {
            setDownLoading(false)
            // Check if the response contains a valid content type
            const contentType = response.headers['content-type'];
            if (contentType && contentType.toLowerCase().includes('application/pdf')) {
                const blob = new Blob([response.data], { type: contentType });

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${name}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.custom((t) => <CustomToast type="info" message="File is downloading." />);
            } else {
                toast.error('Invalid content type. Unable to download the file.');
            }
          })
          .catch(() => {
            setDownLoading(false)
            toast.error("Error downloading certificate");
          });
    };
    
    const handleCancelClicked = () => {
        toast.custom((t) => <CustomToast type="info" message="You have cancelled download of the certificate" />);
    };
  return (<>
    <div
      className="modal fade "
      id="myModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Download Certificates
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
          {loading ? (
            <List />
            ) : (<>    
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationComponentOptions={paginationOptions}
                />
            </>)}
          </div>
        </div>
      </div>
    </div>
    <Toaster/>
    </>
  );
}

export default CertificatesModal;
