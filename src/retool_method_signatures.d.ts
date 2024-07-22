/**
  * This method allows you to add boolean state to your component.
  * Like any other component in Retool, custom components can have their own state, which you can then edit using the inspector.
  *
  * @param {string} name The name of the state used internally, and the label that will be used in the Inspector to identify it.
  *   This should be an alphanumerical string with no spaces.
  * @param {boolean} [initialValue] The initial value for the state when the component is dragged onto the canvas.
  * @param {('text' | 'checkbox' | 'hidden')} [inspector] What kind of Inspector will be used when a builder is editing this state.
  * @param {string} [description] What will be displayed in the tooltip of the Inspector for this state.
  * @param {string} [label] An override for the label used in the Inspector for this state.
  *
  * @return {[boolean, (newValue: boolean) => void]} The value of the state, and a function to update it.
  */
function useStateBoolean({
    name,
    initialValue,
    inspector,
    description,
    label,
}: {
    name: string
    initialValue?: boolean
    label?: string
    description?: string
    inspector?: 'text' | 'checkbox' | 'hidden'
}): readonly [boolean, (newValue: boolean) => void]

/**
  * This method allows you to add number state to your component.
  * Like any other component in Retool, custom components can have their own state, which you can then edit using the Inspector.
  *
  * @param {string} name The name of the state used internally, and the label that will be used in the Inspector to identify it.
  *   This should be an alphanumerical string with no spaces.
  * @param {number} [initialValue] The initial value for the state when the component is dragged onto the canvas.
  * @param {('text' | 'hidden')} [inspector] What kind of Inspector will be used when a builder is editing this state.
  * @param {string} [description] What will be displayed in the tooltip of the Inspector for this state.
  * @param {string} [label] An override for the label used in the Inspector for this state.
  *
  * @return {[number, (newValue: number) => void]} The value of the state, and a function to update it.
  */
function useStateNumber({
    name,
    initialValue,
    inspector,
    description,
    label,
}: {
    name: string
    initialValue?: number
    label?: string
    description?: string
    inspector?: 'text' | 'hidden'
}): readonly [number, (newValue: number) => void]

/**
  * This method allows you to add string state to your component.
  * Like any other component in Retool, custom components can have their own state, which you can then edit using the Inspector.
  *
  * @param {string} name The name of the state used internally, and the label that will be used in the Inspector to identify it.
  *   This should be an alphanumerical string with no spaces.
  * @param {string} [initialValue] The initial value for the state when the component is dragged onto the canvas.
  * @param {('text' | 'hidden')} [inspector] What kind of Inspector will be used when a builder is editing this state.
  * @param {string} [description] What will be displayed in the tooltip of the Inspector for this state.
  * @param {string} [label] An override for the label used in the Inspector for this state.
  *
  * @return {[string, (newValue: string) => void]} The value of the state, and a function to update it.
  */
function useStateString({
    name,
    initialValue,
    inspector,
    description,
    label,
}: {
    name: string
    initialValue?: string
    label?: string
    description?: string
    inspector?: 'text' | 'hidden'
}): readonly [string, (newValue: string) => void]

/**
  * This method allows you to add enumeration state to your component. This is state that can have a value drawn from a limited set of strings.
  * Like any other component in Retool, custom components can have their own state, which you can then edit using the Inspector.
  *
  * @param {string} name The name of the state used internally, and the label that will be used in the Inspector to identify it.
  *   This should be an alphanumerical string with no spaces.
  * @param {T} enumDefinition An array of string literals describing the possible enum values. The strings must be alphanumeric with no spaces.
  * @param {T[number]} [initialValue] The initial value for the state when the component is dragged onto the canvas.
  * @param {{[K in T[number]]: string}} [enumLabels] Alternative labels to use for enums when displaying them.
  * @param {('segmented' | 'select')} [inspector] What kind of Inspector will be used when a builder is editing this state.
  * @param {string} [description] What will be displayed in the tooltip of the Inspector for this state.
  * @param {string} [label] An override for the label used in the Inspector for this state.
  *
  * @return {[T[number], (newValue: T[number]) => void]} The value of the state, and a function to update it.
  */
function useStateEnumeration<T extends string[]>({
    name,
    enumDefinition,
    initialValue,
    enumLabels,
    inspector,
    description,
    label,
}: {
    name: string
    initialValue?: T[number]
    enumDefinition: T
    enumLabels?: {
        [K in T[number]]: string
    }
    inspector?: 'segmented' | 'select' | 'hidden'
    description?: string
    label?: string
}): readonly [T[number], (newValue: T[number]) => void]

/**
  * This method allows you to add serializable object state to your component.
  * Like any other component in Retool, custom components can have their own state, which you can then edit using the Inspector.
  *
  * @param {string} name The name of the state used internally, and the label that will be used in the Inspector to identify it.
  *   This should be an alphanumerical string with no spaces.
  * @param {SerializableObject} [initialValue] The initial value for the state when the component is dragged onto the canvas.
  * @param {('text' | 'hidden')} [inspector] What kind of Inspector will be used when a builder is editing this state.
  * @param {string} [description] What will be displayed in the tooltip of the Inspector for this state.
  * @param {string} [label] An override for the label used in the Inspector for this state.
  *
  * @return {[SerializableObject, (newValue: SerializableObject) => void]} The value of the state, and a function to update it.
  */
function useStateObject({
    name,
    initialValue,
    inspector,
    description,
    label,
}: {
    name: string
    initialValue?: SerializableObject
    inspector?: 'text' | 'hidden'
    description?: string
    label?: string
}): readonly [SerializableObject, (newValue: SerializableObject) => void]

/**
  * This method allows you to add serializable array state to your component.
  * Like any other component in Retool, custom components can have their own state, which you can then edit using the Inspector.
  *
  * @param {string} name The name of the state used internally, and the label that will be used in the Inspector to identify it.
  *   This should be an alphanumerical string with no spaces.
  * @param {SerializableArray} [initialValue] The initial value for the state when the component is dragged onto the canvas.
  * @param {('text' | 'hidden')} [inspector] What kind of Inspector will be used when a builder is editing this state.
  * @param {string} [description] What will be displayed in the tooltip of the Inspector for this state.
  * @param {string} [label] An override for the label used in the Inspector for this state.
  *
  * @return {[SerializableArray, (newValue: SerializableArray) => void]} The value of the state, and a function to update it.
  */
function useStateArray({
    name,
    initialValue,
    inspector,
    description,
    label,
}: {
    name: string
    initialValue?: SerializableArray
    inspector?: 'text' | 'hidden'
    description?: string
    label?: string
}): readonly [SerializableArray, (newValue: SerializableArray) => void]