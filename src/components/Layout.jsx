import styled from "@emotion/styled";
import NavLink from "components/NavLink";
import {Outlet} from "react-router-dom";
import routes from 'routes';

const Link = styled(NavLink)`
  &.active {
    color: red;
  }
`;

const Menu = styled.ul`
  padding-bottom: 20px;

  li {
    float: left;
    margin-right: 15px;

    position: relative;
    left: -10px;
    top: -5px;

    list-style-type: none;
    cursor: pointer;

    border: 1px solid gray;
    border-radius: 5px;
  }

  li:hover {
    background-color: #e7e7e7;
  }

  li a {
    text-decoration: none;
    padding: 5px;
    display: block;
  }

  & + * {
    clear: both;
  }
`;

const Layout = () => <>
  <Menu>
    <li><Link to={routes.root} end>Counter</Link></li>
    <li><Link to={routes.constructor.replace(':id', '1')}>Constructor #1</Link></li>
    <li><Link to={routes.constructor.replace(':id', '2')}>Constructor #2</Link></li>
    <li><Link to={routes.constructor.replace(':id', '3')}>Constructor #3</Link></li>
    <li><Link to={routes.constructor.replace(':id', '4')}>Constructor #4</Link></li>
    <li><Link to={routes.constructor.replace(':id', '5')}>Constructor #5</Link></li>
    <li><Link to={routes.viewer.replace(':id', '1')}>Viewer 1</Link></li>
    <li><Link to={routes.test}>Test</Link></li>
  </Menu>

  <hr/>

  <Outlet/>
</>;

export default Layout;
