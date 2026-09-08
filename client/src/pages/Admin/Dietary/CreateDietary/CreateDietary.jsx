import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_SERVER_URL ?? process.env.REACT_APP_SERVER_ITEMS_URL ?? "http://localhost:80"

function CreateDietary() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    const handleDescription = (e) => setDescription(e.target.value);
    const handleName = (e) => setName(e.target.value);

    const ItemhandleSubmit = (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!name || !description) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const requestBody = { name, description };

        axios
            .post(`${url}/api/items/dietary`, requestBody)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    console.log("Category Inserted.");
                    navigate("/dietary");
                }
            })
            .catch((error) => {
                console.error(error);
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            });
    };
    return (
        <div className="main">
            <div>
                <h1>Create Category</h1>
                <div className="inputwrap">
                    <form onSubmit={ItemhandleSubmit}>
                        <input className="forms mt-4 m-2" type="text" name="name" value={name} placeholder="Nome da Categoria" onChange={handleName} /><br />

                        <textarea className="forms m-2" name="description" placeholder="Descricação da Categoria" value={description} onChange={handleDescription} /><br />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button className="button m-2" type="submit">Create Category</button>
                    </form>
                </div>
            </div>

        </div>
    );

}

export default CreateDietary;