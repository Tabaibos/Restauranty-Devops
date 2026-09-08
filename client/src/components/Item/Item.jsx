import { Link } from 'react-router-dom';


function Oferta(props) {
    return (<div>


        <Link to={`/items${props.item._id}`}>
            {props.item.name}
        </Link>

    </div>)
}
export default Oferta