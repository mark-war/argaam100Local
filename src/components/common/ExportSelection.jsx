import React, { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Helper function to transform JSON data into tree structure
const transformDataToTree = (data) => {
  return data.pages.map((page) => ({
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

const ExportSelection = () => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const { lang } = useParams();
  const pages = useSelector((state) => state.pages);

  const treeData = transformDataToTree(pages);

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={true}
      className={
        lang == "en" ? "copylinkltr growthcom" : "copylinkrtl growthcom"
      }
      onRequestClose={onRequestClose}
      style={{
        content: {
          zIndex: 99999,
          width: "30%",
          height: "100px",
          direction: lang == "en" ? " ltr" : " rtl",
          top: "50% !important",
        },
      }}
    >
      <h2>Export To Excel</h2>
      <CheckboxTree
        nodes={treeData}
        checked={checked}
        expanded={expanded}
        onCheck={(checked) => setChecked(checked)}
        onExpand={(expanded) => setExpanded(expanded)}
        iconsClass="fa5"
      />
    </ReactModal>
  );
};

export default ExportSelection;
