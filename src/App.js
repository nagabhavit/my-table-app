import React, { useState } from 'react';
import { Can } from '@casl/react';
import { defineRulesFor } from './ability';
import './App.css';

function App() {
  const [role, setRole] = useState('user'); 
  const ability = defineRulesFor(role);

  return (
    <div className="App">
      <div className="rbac-card">
        
        <div className="rbac-header">
          <h1>RBAC System</h1>
          <span className={`role-badge role-${role}`}>
            {role}
          </span>
        </div>

        <div className="controls">
          <button className="btn-switch" onClick={() => setRole('admin')}>
            Login as Admin
          </button>
          <button className="btn-switch" onClick={() => setRole('user')}>
            Login as User
          </button>
        </div>

        <Can I="read" a="Post" ability={ability}>
          <div className="content-area">
            <h3>Project: Secure Table Data</h3>
            <p>This content is visible to both Users and Admins.</p>
            
            <div className="action-group">
              <Can I="update" a="Post" ability={ability}>
                <button className="btn-action edit-btn">Edit Document</button>
              </Can>

              <Can I="delete" a="Post" ability={ability}>
                <button className="btn-action delete-btn">Delete Permanently</button>
              </Can>
            </div>
          </div>
        </Can>

        {!ability.can('read', 'Post') && (
          <p style={{ color: 'red', textAlign: 'center' }}>
            Access Denied: You do not have permission to view this content.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;