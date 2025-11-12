import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import adminIcon from "../assets/adminIconMennu.svg";

const Navigationbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["common", "navbar"]);

  const isCommunityRoute =
    location.pathname.startsWith("/community/") ||
    location.pathname.startsWith("/blog/");

  const switchLang = (lng: "en" | "th") => {
    i18n.changeLanguage(lng);
  };

  const handleNavItemClick = (
    event: React.MouseEvent,
    callback: () => void,
    disabled = false
  ) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    callback();
  };

  const isNasDisabled = true;
  const isMeetingDisabled = true;

  const navLinkStyle = {
    fontFamily: "var(--font-heading)",
    fontWeight: 500,
    fontSize: "17.88px",
    letterSpacing: "2%",
    color: "#A1A1A1",
    textDecoration: "none",
    transition: "color 0.3s ease",
    position: "relative" as const,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap" as const,
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    color: "#FFFFFF",
    whiteSpace: "nowrap" as const,
  };

  const dropdownStyle = {
    ...navLinkStyle,
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "0 15px",
  };

  const [showProfileDropdownMobile, setShowProfileDropdownMobile] =
    useState(false);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      fixed="top"
      className="w-100"
      style={{
        height: "84px",
        backgroundColor: "#222222",
        padding: "0px 20px 0px 40px",
      }}
    >
      <Container
        fluid
        style={{
          height: "100%",
          padding: 0,
          margin: 0,
        }}
      >
        <Navbar.Brand
          as={Link}
          to="/"
          className="ms-3 d-flex align-items-center"
        >
          <img src={logo} alt="Logo" height={40} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          className="d-lg-none me-3"
        />

        {/* // Mobile Navbar */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="text-white d-lg-none"
          style={{
            backgroundColor: "#222222",
            width: "250px",
            height: "100vh",
          }}
        >
          <Offcanvas.Header
            closeButton
            style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Navbar.Brand as={Link} to="/" className="mx-auto">
              <img src={logo} alt="Logo" height={40} />
            </Navbar.Brand>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <Nav className="flex-column w-100">
              <Nav.Link
                as={Link}
                to="/"
                className={`tec-nav-link${
                  location.pathname === "/" ? " active" : ""
                }`}
                onClick={() => setExpanded(false)}
              >
                {t("navbar:home")}
                {location.pathname === "/" && (
                  <span className="tec-navbar-underline" />
                )}
              </Nav.Link>
              <NavDropdown
                title={
                  <span
                    className={
                      location.pathname.startsWith("/services/") ? "active" : ""
                    }
                    style={{
                      position: "relative",
                      color: location.pathname.startsWith("/services/")
                        ? "#00a3ff"
                        : undefined,
                      fontWeight: location.pathname.startsWith("/services/")
                        ? "bold"
                        : undefined,
                      borderRadius: "8px",
                      display: "block",
                      padding: "1.2rem 0",
                    }}
                  >
                    {t("navbar:serviceAndSolutions")}
                    {location.pathname.startsWith("/services/") && (
                      <span
                        className="tec-navbar-underline"
                        style={{
                          left: 0,
                          right: 0,
                          margin: "auto",
                          bottom: 0,
                          width: "100%",
                          position: "absolute",
                        }}
                      />
                    )}
                  </span>
                }
                show={showServicesDropdown}
                onToggle={setShowServicesDropdown}
                className={`w-100${
                  location.pathname.startsWith("/services/") ? " active" : ""
                }`}
                menuVariant="dark"
              >
                {" "}
                <NavDropdown.Item
                  as={Link}
                  to="/services/network-solution"
                  className={`dropdown-item ${
                    location.pathname === "/services/network-solution"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:networkSolution")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/services/data-center"
                  className={`dropdown-item ${
                    location.pathname === "/services/data-center"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:dataCenter")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/services/data-management"
                  className={`dropdown-item ${
                    location.pathname === "/services/data-management"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:dataManagement")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/services/centralize-management"
                  className={`dropdown-item ${
                    location.pathname === "/services/centralize-management"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:centralizeManagement")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/services/multimedia-solution"
                  className={`dropdown-item ${
                    location.pathname === "/services/multimedia-solution"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:multimediaSolutions")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/services/digital-transformation"
                  className={`dropdown-item ${
                    location.pathname === "/services/digital-transformation"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:digitalTransformation")}
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    style={{
                      position: "relative",
                      color: isCommunityRoute ? "#00a3ff" : "#A1A1A1",
                      fontWeight: isCommunityRoute ? "bold" : undefined,
                      borderRadius: "8px",
                      padding: "1.2rem 0",
                      width: "100%",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {t("navbar:ourCommunity")}
                    {isCommunityRoute && (
                      <span
                        className="tec-navbar-underline"
                        style={{
                          left: 0,
                          right: 0,
                          margin: "auto",
                          bottom: 0,
                          width: "100%",
                          position: "absolute",
                        }}
                      />
                    )}
                  </span>
                }
                show={showCommunityDropdown}
                onToggle={setShowCommunityDropdown}
                className={`w-100${isCommunityRoute ? " active" : ""}`}
                menuVariant="dark"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/community/company-events"
                  className={`dropdown-item ${
                    location.pathname === "/community/company-events"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:companyEvent")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/community/society"
                  className={`dropdown-item ${
                    location.pathname === "/community/society" ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:society")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/community/knowledge"
                  className={`dropdown-item ${
                    location.pathname === "/community/knowledge" ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowServicesDropdown(false);
                    setExpanded(false);
                  }}
                >
                  {t("navbar:knowledge")}
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link
                as={Link}
                to="/#contact-section"
                className={`tec-nav-link${
                  location.pathname === "#contact-section" ? " active" : ""
                }`}
                onClick={() => {
                  setShowServicesDropdown(false);
                  setExpanded(false);
                }}
              >
                {t("navbar:contact")}
                {location.pathname === "/" &&
                  location.hash === "#contact-section" && (
                    <span className="tec-navbar-underline" />
                  )}
              </Nav.Link>
              <NavDropdown
                title={
                  <img
                    src={adminIcon}
                    width={22}
                    height={22}
                    alt="admin"
                    style={{
                      filter:
                        showProfileDropdownMobile ||
                        location.pathname === "/meeting-rooms"
                          ? "none"
                          : "grayscale(1) opacity(0.7)",
                    }}
                  />
                }
                show={showProfileDropdownMobile}
                onToggle={setShowProfileDropdownMobile}
                className={`w-100${showProfileDropdownMobile ? " active" : ""}`}
                menuVariant="dark"
              >
                <NavDropdown.Item
                  as="a"
                  href="https://tec-asia.quickconnect.to/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`dropdown-item ${isNasDisabled ? "disabled" : ""}`}
                  aria-disabled={isNasDisabled}
                  tabIndex={isNasDisabled ? -1 : undefined}
                  style={
                    isNasDisabled
                      ? { pointerEvents: "none", opacity: 0.5 }
                      : undefined
                  }
                  onClick={(event) =>
                    handleNavItemClick(
                      event,
                      () => setExpanded(false),
                      isNasDisabled
                    )
                  }
                >
                  {t("navbar:nas")}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/meeting-rooms"
                  className={`dropdown-item ${
                    location.pathname === "/meeting-rooms" ? "active" : ""
                  } ${isMeetingDisabled ? "disabled" : ""}`}
                  aria-disabled={isMeetingDisabled}
                  tabIndex={isMeetingDisabled ? -1 : undefined}
                  style={
                    isMeetingDisabled
                      ? { pointerEvents: "none", opacity: 0.5 }
                      : undefined
                  }
                  onClick={(event) =>
                    handleNavItemClick(
                      event,
                      () => setExpanded(false),
                      isMeetingDisabled
                    )
                  }
                >
                  {t("navbar:meettingRoom")}
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 500,
                      fontSize: "18px",
                    }}
                  >
                    {i18n.language === "en" ? "English" : "ไทย"}
                  </span>
                }
                id="language-dropdown"
                className="w-100 custom-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item
                  active={i18n.language === "en"}
                  onClick={() => switchLang("en")}
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                  }}
                >
                  English
                </NavDropdown.Item>
                <NavDropdown.Item
                  active={i18n.language === "th"}
                  onClick={() => switchLang("th")}
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                  }}
                >
                  ไทย
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* // Desktop Navbar */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-none d-lg-flex justify-content-end align-items-center w-100"
        >
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={`tec-nav-link${
                location.pathname === "/" ? " active" : ""
              }`}
              style={{
                ...navLinkStyle,
                position: "relative",
                marginRight: "25px",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              {t("navbar:home")}
              {location.pathname === "/" && (
                <span className="tec-navbar-underline" />
              )}
            </Nav.Link>
            <NavDropdown
              title={
                <span
                  className={`tec-nav-link${
                    location.pathname.startsWith("/services/") ? " active" : ""
                  }`}
                  style={{
                    ...dropdownStyle,
                    position: "relative",
                    color: location.pathname.startsWith("/services/")
                      ? "#fff"
                      : "#A1A1A1",
                    display: "inline-block",
                    height: "100%",
                    padding: "0 5px",
                  }}
                >
                  {t("navbar:serviceAndSolutions")}
                  {location.pathname.startsWith("/services/") && (
                    <span className="tec-navbar-underline" />
                  )}
                </span>
              }
              id="services-dropdown"
              show={showServicesDropdown}
              onToggle={(nextShow) => setShowServicesDropdown(nextShow)}
              className={`custom-nav-dropdown ${
                location.pathname.startsWith("/services/") ? "active" : ""
              }`}
              style={{
                marginRight: "25px",
                height: "100%",
              }}
            >
              <NavDropdown.Item
                as={Link}
                to="/services/network-solution"
                className={`dropdown-item ${
                  location.pathname === "/services/network-solution"
                    ? "active"
                    : ""
                }`}
                onClick={() => setShowServicesDropdown(false)}
              >
                {t("navbar:networkSolution")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/services/data-center"
                className={`dropdown-item ${
                  location.pathname === "/services/data-center" ? "active" : ""
                }`}
                onClick={() => setShowServicesDropdown(false)}
              >
                {t("navbar:dataCenter")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/services/data-management"
                className={`dropdown-item ${
                  location.pathname === "/services/data-management"
                    ? "active"
                    : ""
                }`}
                onClick={() => setShowServicesDropdown(false)}
              >
                {t("navbar:dataManagement")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/services/centralize-management"
                className={`dropdown-item ${
                  location.pathname === "/services/centralize-management"
                    ? "active"
                    : ""
                }`}
                onClick={() => setShowServicesDropdown(false)}
              >
                {t("navbar:centralizeManagement")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/services/multimedia-solution"
                className={`dropdown-item ${
                  location.pathname === "/services/multimedia-solution"
                    ? "active"
                    : ""
                }`}
                onClick={() => setShowServicesDropdown(false)}
              >
                {t("navbar:multimediaSolutions")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/services/digital-transformation"
                className={`dropdown-item ${
                  location.pathname === "/services/digital-transformation"
                    ? "active"
                    : ""
                }`}
                onClick={() => setShowServicesDropdown(false)}
              >
                {t("navbar:digitalTransformation")}
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <div
                  className={`tec-nav-link${
                    isCommunityRoute ? " active" : ""
                  }`}
                  style={{
                    ...dropdownStyle,
                    position: "relative",
                    color: isCommunityRoute ? "#fff" : "#A1A1A1",
                  }}
                >
                  {t("navbar:ourCommunity")}
                  {isCommunityRoute && (
                    <span className="tec-navbar-underline" />
                  )}
                </div>
              }
              id="community-dropdown"
              show={showCommunityDropdown}
              onToggle={(nextShow) => setShowCommunityDropdown(nextShow)}
              className={`custom-nav-dropdown ${
                isCommunityRoute ? "active" : ""
              }`}
              style={{
                marginRight: "25px",
                height: "100%",
              }}
            >
              <NavDropdown.Item
                as={Link}
                to="/community/company-events"
                className={`dropdown-item ${
                  location.pathname === "/community/company-events"
                    ? "active"
                    : ""
                }`}
                onClick={() => setShowCommunityDropdown(false)}
              >
                {t("navbar:companyEvent")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/community/society"
                className={`dropdown-item ${
                  location.pathname === "/community/society" ? "active" : ""
                }`}
                onClick={() => setShowCommunityDropdown(false)}
              >
                {t("navbar:society")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/community/knowledge"
                className={`dropdown-item ${
                  location.pathname === "/community/knowledge" ? "active" : ""
                }`}
                onClick={() => setShowCommunityDropdown(false)}
              >
                {t("navbar:knowledge")}
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              as={Link}
              to="/#contact-section"
              onClick={(e) => {
                e.preventDefault();
                navigate("/#contact-section");
              }}
              className={`tec-nav-link${
                location.pathname === "#contact-section" ? " active" : ""
              }`}
              style={{
                ...(location.pathname === "/" &&
                location.hash === "#contact-section"
                  ? activeNavLinkStyle
                  : navLinkStyle),
                marginRight: "50px",
                height: "100%",
              }}
            >
              {t("navbar:contact")}
              {location.pathname === "/" &&
                location.hash === "#contact-section" && (
                  <span className="tec-navbar-underline" />
                )}
            </Nav.Link>
            <NavDropdown
              title={
                <img
                  src={adminIcon}
                  alt="admin"
                  width={24}
                  height={24}
                  style={{
                    filter:
                      location.pathname === "/nas" ||
                      location.pathname === "/meeting-rooms"
                        ? "none"
                        : "grayscale(1) opacity(0.7)",
                  }}
                />
              }
              id="profile-dropdown"
              className="custom-nav-dropdown profile-dropdown"
              style={{
                marginLeft: "0px",
                marginRight: "50px",
                height: "100%",
              }}
            >
              <NavDropdown.Item
                as="a"
                href="https://tec-asia.quickconnect.to/"
                target="_blank"
                rel="noopener noreferrer"
                className={`dropdown-item ${isNasDisabled ? "disabled" : ""}`}
                aria-disabled={isNasDisabled}
                tabIndex={isNasDisabled ? -1 : undefined}
                style={
                  isNasDisabled
                    ? { pointerEvents: "none", opacity: 0.5 }
                    : undefined
                }
                onClick={(event) =>
                  handleNavItemClick(event, () => {}, isNasDisabled)
                }
              >
                {t("navbar:nas")}
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/meeting-rooms"
                className={`dropdown-item ${
                  location.pathname === "/meeting-rooms" ? "active" : ""
                } ${isMeetingDisabled ? "disabled" : ""}`}
                aria-disabled={isMeetingDisabled}
                tabIndex={isMeetingDisabled ? -1 : undefined}
                style={
                  isMeetingDisabled
                    ? { pointerEvents: "none", opacity: 0.5 }
                    : undefined
                }
                onClick={(event) =>
                  handleNavItemClick(event, () => {}, isMeetingDisabled)
                }
              >
                {t("navbar:meetingRoom")}
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 500,
                    fontSize: "18px",
                  }}
                >
                  {i18n.language === "en" ? "English" : "ไทย"}
                </span>
              }
              id="language-dropdown"
              className="custom-nav-dropdown "
              align="end"
            >
              <NavDropdown.Item
                active={i18n.language === "en"}
                onClick={() => switchLang("en")}
                style={{ fontFamily: "var(--font-heading)", fontSize: "16px" }}
              >
                English
              </NavDropdown.Item>
              <NavDropdown.Item
                active={i18n.language === "th"}
                onClick={() => switchLang("th")}
                style={{ fontFamily: "var(--font-heading)", fontSize: "16px" }}
              >
                ไทย
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {/* <Nav className="ms-auto"></Nav> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
