interface InputProps<T> {
    value: T
    onChange: (value: T) => void
}
interface FieldPropsWithoutTransformers<K, TStateValue> {
    name: K
    toValue?: never
    fromValue?: never
    children: (inputProps: InputProps<TStateValue>) => React.ReactElement
}
interface FieldPropsWithTransformers<K, TStateValue, TInputValue>  {
    name: K
    toValue: (value: TStateValue) => TInputValue
    fromValue: (value: TInputValue) => TStateValue
    children: (inputProps: InputProps<TInputValue>) => React.ReactElement
}
type FieldProps<K, TStateValue, TInputValue> =
    | FieldPropsWithoutTransformers<K, TStateValue>
    | FieldPropsWithTransformers<K, TStateValue, TInputValue>

type Values = Record<string, any>

interface Form<T extends Values> {
    values: T
}

function createFieldComponent<T extends Values>(form: Form<T>) {
    return <
        K extends keyof T,
        TStateValue extends T[K],
        TInputValue extends any,
        Props extends FieldProps<K, TStateValue, TInputValue>,
    >({ name, toValue, fromValue, children }: Props) => {
        const value = form.values[name]
        const transformedValue = toValue ? toValue(value) : value
        const onChange = (value: TInputValue) => {
            form.values[name] = fromValue ? fromValue(value) : value as T[K]
        }
        return children({ value, onChange })
    }
}

interface FormData {
    name: string
    age: number
}

const form: Form<FormData> = {
    values: {
        name: 'John',
        age: 18,
    }
}


const Field = createFieldComponent(form)

// props is `any`, but must be `InputProps<number>`
// because the `toValue` function is not specified
const a = <Field name='age'>{props => <input />}</Field>

// props is `any`, but must be `InputProps<string>`
// because the return type of the `toValue` function is a string
const b = (
    <Field
        name='age'
        toValue={value => value.toString()}
        fromValue={value => Number(value)}
    >
        {props => <input />}
    </Field>
)
