import * as React from "react"
import { Text } from "react-native"
import TextInputError from "../connectors/ui/TextInputError"
import { ERR_INPUT } from "../constants/errFormInput"
import { tr } from "../i18n/t"
import { IAuthModel } from "../model/Auth"
import { navigate } from "../utils/navHelper"
import { Col, Form, Logo, ValidTextIcon } from "../ui/index"

import styles from "../styles/index"

export interface ILoginState {
	email: string
	password: string
}

export interface ILoginProps {
	auth?: IAuthModel
	login?: (email: string, password: string) => void
	onRoute?: (route: string) => void
}

export class Login extends React.Component<ILoginProps, ILoginState> {
	public state = {
		email: this.props.auth.email || "",
		password: "",
	}

	public isDisabled() {
		const { email, password } = this.state

		return email.length === 0 || password.length === 0
	}

	public render() {
		const { login } = this.props
		const { email, password } = this.state

		return (
			<Form>
				<Logo />

				<TextInputError
					errCodes={ERR_INPUT.login}
					globalErr={true}
					label={tr.Login}
					onChange={(email: string) => this.setState({ email })}
					value={email}
				/>

				<TextInputError
					errCodes={ERR_INPUT.login}
					globalErr={true}
					label={tr.Password}
					onChange={(password: string) => this.setState({ password })}
					secureTextEntry
					value={password}
					showErr={true}
				/>

				<ValidTextIcon onPress={() => login(email, password)} disabled={this.isDisabled()} title={tr.Connect} />

				<Col size={1} style={styles.line} onPress={() => navigate("RecoverPassword")}>
					<Text style={styles.minitext}>{tr.Password_forgotten}</Text>
				</Col>
			</Form>
		)
	}
}