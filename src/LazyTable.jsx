import React, { useState, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; 
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 

ModuleRegistry.registerModules([AllCommunityModule]);

const LazyTable = () => {
  const [gridApi, setGridApi] = useState(null);
  const serverDataRef = useRef([]);

  const [columnDefs] = useState([
    { 
      field: 'athlete', 
      headerName: 'Athlete', 
      pinned: 'left', 
      width: 200,
      checkboxSelection: true, 
      headerCheckboxSelection: true 
    },
    { 
      field: 'age', 
      headerName: 'Age', 
      pinned: 'left', 
      width: 100 
    },
    { field: 'country', width: 150 },
    { field: 'year', width: 100 },
    { field: 'sport', width: 150 },
    { field: 'gold', width: 100 },
    { field: 'silver', width: 100 },
    { field: 'bronze', width: 100 },
    { field: 'total', width: 100 },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 200,
      cellRenderer: (params) => (
        <div>
          <button onClick={() => alert('View ' + params.data.athlete)}>View</button>
          <button onClick={() => alert('Delete ' + params.data.athlete)} style={{marginLeft: 5, color:'red'}}>Delete</button>
        </div>
      )
    }
  ]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);

    fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => {
        serverDataRef.current = data;
        
        const dataSource = {
          rowCount: undefined,
          getRows: (params) => {
            console.log(`Loading rows: ${params.startRow} to ${params.endRow}`);
            setTimeout(() => {
              const rowsThisPage = serverDataRef.current.slice(params.startRow, params.endRow);
              const lastRow = serverDataRef.current.length <= params.endRow ? serverDataRef.current.length : -1;
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          }
        };

        params.api.setGridOption('datasource', dataSource);
      });
  }, []);

  const handleDownload = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({ onlySelected: true });
    }
  };

  return (
    <div style={{ padding: '20px', height: '100vh' }}>
      <h2>Ag Grid Lazy Loading</h2>
      
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => alert("Add Record Logic Here!")} style={{ padding: 10, marginRight: 10, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          + Add Record
        </button>
        
        <button onClick={handleDownload} style={{ padding: 10, background: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}>
          Download Selected
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          
          rowModelType={'infinite'}
          cacheBlockSize={10} 
          infiniteInitialRowCount={10}
          
          rowSelection={'multiple'} 
          rowMultiSelectWithClick={true}
          
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default LazyTable;