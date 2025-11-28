import {
  formatAttributes,
  formatBytes,
  formatSeconds,
  getFileName,
} from '../../lib/util';
import React, { useState } from 'react';
import { Checkbox, Header, Icon, List, Table } from 'semantic-ui-react';

const FileList = ({
  directoryName,
  disabled,
  files,
  footer,
  locked,
  onClose,
  onSelectionChange,
}) => {
  const [folded, setFolded] = useState(false);

  const [sortBy, setSortBy] = useState('filename');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedFiles = [...files].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'size' || sortBy === 'length') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  return (
    <div style={{ opacity: locked ? 0.5 : 1 }}>
      <Header
        className="filelist-header"
        size="small"
      >
        <div>
          <Icon
            link={!locked}
            name={locked ? 'lock' : folded ? 'folder' : 'folder open'}
            onClick={() => !locked && setFolded(!folded)}
            size="large"
          />
          {directoryName}

          {Boolean(onClose) && (
            <Icon
              className="close-button"
              color="red"
              link
              name="close"
              onClick={() => onClose()}
            />
          )}
        </div>
      </Header>
      {!folded && files && files.length > 0 && (
        <List>
          <List.Item>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="filelist-selector">
                    <Checkbox
                      checked={files.filter((f) => !f.selected).length === 0}
                      disabled={disabled}
                      fitted
                      onChange={(event, data) =>
                        files.map((f) => onSelectionChange(f, data.checked))
                      }
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="filelist-filename"
                    onClick={() => handleSort('filename')}
                    style={{ cursor: 'pointer' }}
                  >
                    File{' '}
                    {sortBy === 'filename' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="filelist-size"
                    onClick={() => handleSort('size')}
                    style={{ cursor: 'pointer' }}
                  >
                    Size{' '}
                    {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="filelist-attributes"
                    onClick={() => handleSort('bitRate')}
                    style={{ cursor: 'pointer' }}
                  >
                    Attributes{' '}
                    {sortBy === 'bitRate' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="filelist-length"
                    onClick={() => handleSort('length')}
                    style={{ cursor: 'pointer' }}
                  >
                    Length{' '}
                    {sortBy === 'length' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedFiles.map((f) => (
                  <Table.Row key={f.filename}>
                    <Table.Cell className="filelist-selector">
                      <Checkbox
                        checked={f.selected}
                        disabled={disabled}
                        fitted
                        onChange={(event, data) =>
                          onSelectionChange(f, data.checked)
                        }
                      />
                    </Table.Cell>
                    <Table.Cell className="filelist-filename">
                      {locked ? <Icon name="lock" /> : ''}
                      {getFileName(f.filename)}
                    </Table.Cell>
                    <Table.Cell className="filelist-size">
                      {formatBytes(f.size)}
                    </Table.Cell>
                    <Table.Cell className="filelist-attributes">
                      {formatAttributes(f)}
                    </Table.Cell>
                    <Table.Cell className="filelist-length">
                      {formatSeconds(f.length)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              {footer && (
                <Table.Footer fullWidth>
                  <Table.Row>
                    <Table.HeaderCell colSpan="5">{footer}</Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
          </List.Item>
        </List>
      )}
    </div>
  );
};

export default FileList;
