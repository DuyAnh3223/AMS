package spring.serverspringboot.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import spring.serverspringboot.dto.auth.IntrospectRequest;
import spring.serverspringboot.service.AuthService;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomJwtDecoder implements JwtDecoder {

    @NonFinal
    @Value("${jwt.signerKey}")
    String signingKey;

    AuthService authService;

    @NonFinal
    NimbusJwtDecoder nimbusJwtDecoder;

    @Override
    public Jwt decode(String token) throws JwtException {
        var response = authService.introspect(
                IntrospectRequest.builder().token(token).build());
        if(!response.isValid()){
            throw new JwtException("Invalid token");
        }
        if(Objects.isNull(nimbusJwtDecoder)){
            SecretKeySpec secretKey = new SecretKeySpec(signingKey.getBytes(), "HS512");

            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
