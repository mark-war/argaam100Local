import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Row, Col, Card, Table } from "react-bootstrap";

const TopCompaniesTable = ({ sections }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);

  const renderTableRows = (data) =>
    data.map(({ rank, company, logo, chartValue }) => (
      <tr key={rank}>
        <td>
          <span className="bg_tag">{rank}</span>
        </td>
        <td className="td_img">
          <img alt="Image" src={logo} /> {company}
        </td>
        <td>
          <div className="charts_table_bg" style={{ width: `${chartValue}%` }}>
            <span className="bg"></span>{" "}
            <span>{chartValue.toLocaleString()}</span>
          </div>
        </td>
      </tr>
    ));

  return (
    <div className="px-layout col_space mt-4 pt-1">
      <Row>
        {sections.map((section, index) => (
          <Col lg={6} key={index}>
            <div className="tabs_inner_nav row px-3">
              <div className="col-6">
                <p className="sub_heading">{section.title}</p>
              </div>
              <div className="col-6">
                <div className="flex-fill justify-content-end">
                  {/* Tabs Starts */}
                  <ul className="tabs_nav tabs_inner navbar-nav align-items-center flex-row justify-content-end">
                    {section.subtabs.map((subTab, index) => (
                      <li className="nav-item" key={index}>
                        <button
                          className={`nav-link cursor-pointer ${
                            activeSubTab === subTab.id ? "active" : ""
                          }`}
                          onClick={() => setActiveSubTab(subTab.id)}
                        >
                          <span>{subTab.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {/* Tabs Ends */}
                </div>
              </div>
            </div>

            {/* Card Rendering */}
            <Card className="rounded border-0 table_chart">
              <Card.Body className="px-layout bg-white rounded">
                <div className="table-responsive">
                  <Table className="table_layout" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Companies</th>
                        <th>Charts</th>
                      </tr>
                    </thead>

                    {activeSubTab === 1 && (
                      <tbody className="border_top_0">
                        <tr>
                          <td colSpan="3">
                            <img
                              alt="Image"
                              src="/assets/images/chart_img.png"
                              className="img-fluid nav_chart"
                            />
                          </td>
                        </tr>
                      </tbody>
                    )}

                    {activeSubTab === 2 && (
                      <tbody>{renderTableRows(section.data.lastClose)}</tbody>
                    )}

                    {activeSubTab === 3 && (
                      <tbody>
                        {renderTableRows(section.data.lastFiscalPeriod)}
                      </tbody>
                    )}
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Define PropTypes for the component
TopCompaniesTable.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      data: PropTypes.shape({
        lastClose: PropTypes.arrayOf(
          PropTypes.shape({
            rank: PropTypes.number.isRequired,
            company: PropTypes.string.isRequired,
            logo: PropTypes.string.isRequired,
            chartValue: PropTypes.number.isRequired,
          })
        ).isRequired,
        lastFiscalPeriod: PropTypes.arrayOf(
          PropTypes.shape({
            rank: PropTypes.number.isRequired,
            company: PropTypes.string.isRequired,
            logo: PropTypes.string.isRequired,
            chartValue: PropTypes.number.isRequired,
          })
        ).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default TopCompaniesTable;
