import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/parameters-ibm"

describe("validation plugin - semantic - parameters-ibm", () => {

  it("should return an error when snake case is not used", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "camelCase",
                "in": "query",
                "description": "description",
                "type": "string"
              }
            ]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.warnings[0].message).toEqual("Parameter name must use snake case.")
  })

  it("should not return a snake case error when \"in\" is set to \"header\" ", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "camelCase",
                "in": "header",
                "description": "description",
                "type": "string"
              }
            ]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(0)
    //expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    //expect(res.errors[0].message).toEqual("Parameter name must use snake case.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when JSON is in the description", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "good_name",
                "in": "query",
                "description": "Please do not put JSON in the description.",
                "type": "string"
              }
            ]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.warnings[0].message).toEqual("Descriptions should not state that the model is a JSON object.")
  })

  it("should not die when a schema contains a description property", () => {
    const spec = {
      "definitions": {
        "Notice": {
          "type": "object",
          "description": "A notice produced for the collection",
          "properties": {
            "notice_id": {
              "type": "string",
              "readOnly": true,
              "description": "Identifies the notice. Many notices may have the same ID. This field exists so that user applications can programmatically identify a notice and take automatic corrective action."
            },
            "description": {
              "type": "string",
              "readOnly": true,
              "description": "The description of the notice"
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when type integer does not have a format", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "good_name",
                "in": "query",
                "description": "This is a good description.",
                "type": "number",
                "format": "int32"
              }
            ]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.errors[0].message).toEqual("Incorrect Format of int32 with Type of number and Description of This is a good description.")
    expect(res.warnings.length).toEqual(0)
  })
})