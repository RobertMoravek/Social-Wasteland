import { Link } from "react-router-dom";

export default function Menu () {
    return (
        <>
            <nav>
                <Link to="/users" className="menu-item">find users</Link>
                <Link to="/friends" className="menu-item">my friends</Link>
                <Link to="/logout" className="menu-item">logout</Link>
            </nav>
        </>
    );
}