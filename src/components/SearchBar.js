import React, {useState} from "react";

function SearchBar(props) {
    const [term, setTerm] = useState('')

    const onFormSubmit = (event) => {
        event.preventDefault();
        props.onFormSubmit(term)

    }

    return <div className="ui segment search-bar">
        <form onSubmit={onFormSubmit} className="ui form">
            <div className="searchbar">
                <label>Video Search</label>
                <input
                    type="text"
                    value={term}
                    onChange={e => setTerm(e.target.value)}/>
            </div>
        </form>
    </div>

}

export default SearchBar;