import { Link } from 'react-router-dom';


function Oferta(props) {
    return (<div>


        {/* <Link to={`/discounts/coupons/${props.coupon._id}`}> */}
        {props.coupon.name}
        {/* </Link> */}

    </div>)
}
export default Oferta