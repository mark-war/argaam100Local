import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css"; // Import CheckboxTree CSS
import {
  FaCheckSquare,
  FaSquare,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const ExportSelection = ({ show, onSelect }) => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [showModal, setShowModal] = useState(show); // Local state to control visibility

  const pages = useSelector((state) => state.pages);
  console.log("PAGES: ", pages);

  // Transform the data into the format required by CheckboxTree
  const transformDataToTree = (pages) => {
    return pages.pages.map((page) => ({
      value: `page-${page.pageId}`,
      label: page.pageNameEn,
      children: page.sections.map((section) => ({
        value: `section-${section.sectionId}`,
        label: section.sectionNameEn,
        children: section.tabs.map((tab) => ({
          value: `tab-${tab.tabId}`,
          label: tab.tabNameEn,
        })),
      })),
    }));
  };

  const handleClose = () => {
    setShowModal(false); // Hide the modal
    onSelect([]); // Optionally pass an empty selection to indicate no changes
  };

  const handleSubmit = () => {
    onSelect(checked); // Pass checked items back to the calling component
    setShowModal(false); // Close the modal after selection
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CheckboxTree
          nodes={transformDataToTree(pages)}
          checked={checked}
          expanded={expanded}
          onCheck={setChecked}
          onExpand={setExpanded}
          icons={{
            check: <FaCheckSquare />,
            uncheck: <FaSquare />,
            halfCheck: <FaCheckSquare style={{ opacity: 0.5 }} />,
            expandClose: <FaChevronRight />,
            expandOpen: <FaChevronDown />,
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Selection
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportSelection;
