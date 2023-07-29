import { Link } from "react-router-dom"
import { Button } from "reactstrap"

function BackButton ({ submit } : { submit: boolean}) {
    return (
        <Link to='/admin' reloadDocument={submit}>
            <Button className='m-4' color='secondary' outline>
                <small>
                    <i className='fa fa-angle-left'></i>
                    &nbsp;
                    Back
                </small>
            </Button> 
        </Link>
    )
}

export default BackButton