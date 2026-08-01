import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerSchema } from "@ecomm/shared";
import { useRegisterMutation } from "../../api/authApi";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import "./auth.css";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const location = useLocation();

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      await register(result.data).unwrap();
      toast.success("Welcome! Your account has been created.");
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message ?? "Could not create your account.");
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Full name" error={errors.name}>
            {(id) => (
              <input
                id={id}
                className="ui-input"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="name"
              />
            )}
          </Field>
          <Field label="Email" error={errors.email}>
            {(id) => (
              <input
                id={id}
                className="ui-input"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
              />
            )}
          </Field>
          <Field label="Password" error={errors.password} hint="At least 8 characters.">
            {(id) => (
              <input
                id={id}
                className="ui-input"
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete="new-password"
              />
            )}
          </Field>
          <Button type="submit" isLoading={isLoading}>
            Sign up
          </Button>
        </form>
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
