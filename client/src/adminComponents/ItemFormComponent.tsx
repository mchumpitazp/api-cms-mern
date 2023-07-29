import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";

interface ItemFormProps {
    itemObj: object,
    defaultValue: boolean,
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void
}

function ItemForm (props: ItemFormProps) {
    const solveInput = (key: string, input: string) => {
        let type: InputType;
        let placeholder: string;

        if (input.includes('http')) {
            type = 'url';
            placeholder = 'https://example.com';
        } else if (Date.parse(input)) {
            type = 'date';
            placeholder = 'DD.MM.YYYY';
        } else {
            type = 'text'; 
            placeholder = 'Enter ' + key;
        }

        return [type, placeholder] as const;
    }

    const renderFormGroups = (itemObj: object)  => {
        const entries = Object.entries(itemObj)
                            .filter(([key, _]) => key !== '_id' && key !== '__v');

        return entries.map((pair: any, i: number) => {
            const [inputType, placeholder] = solveInput(pair[0], pair[1]);
    
            return (
                <FormGroup row key={i}>
                    <Label 
                        for={`input-${pair[0]}`}
                        sm={2} >
                        {pair[0]}
                    </Label>
                    <Col sm={10}>
                        <Input  id={`input-${pair[0]}`}
                                name={pair[0]}
                                defaultValue={props.defaultValue? pair[1] : ''}
                                type={inputType}
                                placeholder={placeholder}
                                required >
                        </Input>
                    </Col>
                </FormGroup>
            )
        });
    }

    return (
        <Form onSubmit={props.onSubmit}>
            {renderFormGroups(props.itemObj)}
            <br />
            <div className='d-flex justify-content-end'>
                <Button color='primary' type='submit'>
                    Submit
                </Button>
            </div>
        </Form>
    )
}

export default ItemForm;