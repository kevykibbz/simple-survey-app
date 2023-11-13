import React from 'react'

function Modal() {
  return (
    <div className="modal fade" id="terms-txt" tabIndex="-1" role="dialog" aria-labelledby="termsLabel" aria-hidden="true">
		<div className="modal-dialog modal-dialog-centered">
			<div className="modal-content">
				<div className="modal-header">
					<h4 className="modal-title" id="termsLabel">Terms and conditions</h4>
					<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div className="modal-body">
                    <h6>1. Acceptance of Terms</h6>
					<p>By accessing and using OpinionHarbor, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these Terms and Conditions, please do not use this Website.</p>
                    <h6>2. User Registration</h6>
					<ul>
						<li><b>a</b><p> To participate in surveys and use certain features of the Website, you may be required to register an account. You agree to provide accurate and up-to-date information during the registration process, including your name, email address, and any other requested information.</p></li>
						<li><b>b</b><p>You are responsible for maintaining the confidentiality of your account credentials, and you are solely responsible for all activities that occur under your account.</p></li>
                    </ul>
                    <h6>3. User Content</h6>
                    <p>You may be asked to submit information and content, including your name, programming stack languages, gender, certificates, and a brief description of yourself. You retain ownership of the content you provide</p>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn_1" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
  )
}

export default Modal