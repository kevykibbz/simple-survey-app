import React, { useEffect,useState,useRef} from 'react';
import DataTable from 'react-data-table-component';
import { List } from 'react-content-loader'
import endpoints from '../Endpoints/Endpoints';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import xmlJs from 'xml-js'; 
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmailSearch from './Modal/EmailSearch';
import { Link } from 'react-router-dom';
import CertificatesModal from './Modal/CertificatesModal';

const SurveyResponse = () => {
    const [loading, setLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(null);

    const emailNameInputRef=useRef(null)

    const [data, setData] = useState([]);

    useEffect(() => {
        const endpoint =
          process.env.NODE_ENV === "production"
            ? endpoints.responses.production
            : endpoints.responses.development;
        axios
          .get(endpoint)
          .then((response) => {
            const jsonData = xmlJs.xml2json(response.data, { compact: true, spaces: 4 });
            const parsedData = JSON.parse(jsonData);
            if (parsedData && parsedData.question_responses && parsedData.question_responses.question_response) {
              const records = parsedData.question_responses.question_response;
              setData(records);
            } else {
            console.error('Invalid question_responses data structure');
            }
            setLoading(false);
          })
          .catch(() => {
            toast.error("Error fetching qusetion");
          });
      }, []);
        


      const columns = [
        {
          name: 'Full Name',
          selector: (row) => row.full_name?._text,
          sortable: true,
          searchable: true, // Enable searching for this column
        },
        {
          name: 'Email Address',
          selector: (row) => row.email_address?._text,
          sortable: true,
          searchable: true, // Enable searching for this column
        },
        {
          name: 'Description',
          selector: (row) => row.description?._text,
          sortable: true,
        },
        {
          name: 'Gender',
          selector: (row) => row.gender?._text,
          sortable: true,
          searchable: true, // Enable searching for this column
        },
        {
          name: 'Programming Stacks',
          selector: (row) => row.programming_stack?._text,
          sortable: true,
        },
        {
          name: 'Certificates',
          selector: (row) => {
            const certificates = row.certificates?.certificate;
            if (certificates) {
              if (Array.isArray(certificates)) {
                return certificates.map((certificate) => (
                  <span key={certificate._attributes.id}>
                    {certificate._text}
                    <br />
                  </span>
                ));
              } else {
                return (
                  <span key={certificates._attributes.id}>
                    {certificates._text}
                    <br />
                  </span>
                );
              }
            }
            return '';
          },
          sortable: true,
        },
        {
          name: 'Date Responded',
          selector: (row) => row.date_responded?._text,
          sortable: true,
        },
        {
          name: 'Select',
          cell: (row) => (
            <Link to="#" data-bs-toggle="modal"  onClick={() => handleSelect(row.id?._text,row.id?._text)} data-bs-target="#myModal" rel="noreferrer">
              <FontAwesomeIcon icon={faFilePdf} /> Certificates
            </Link>
          ),
        },
      ];
    
      const handleSelect = (id) => {
         setSelectedId(id);
      };


      const paginationOptions = {
          rowsPerPageText: 'Rows per page:',
          rangeSeparatorText: 'of',
          selectAllRowsItem: true,
          selectAllRowsItemText: 'All',
      };

      useEffect(() => {
          if(emailNameInputRef.current){
              emailNameInputRef.current.focus();
          }
        }, []);

    return (
      <>
          {loading ? (
            <List />
          ) : (
            <React.Fragment>
              <Link to="#" data-bs-toggle="modal" data-bs-target="#email-search-modal" rel="noreferrer" className="float" title='filter by email address'>
                <FontAwesomeIcon className="my-float" icon={faSearch} />
              </Link>
              <EmailSearch setData={setData}/> 
              <DataTable
                columns={columns}
                data={data}
                pagination
                paginationComponentOptions={paginationOptions}
              />
              <CertificatesModal certificateId={selectedId}/>
            </React.Fragment>
          )}
        <Toaster/>
      </>
    );
};

export default SurveyResponse;