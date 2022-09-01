package rest;

import java.util.Set;
import javax.ws.rs.core.Application;

@javax.ws.rs.ApplicationPath("api")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(cors.CorsFilter.class);
        resources.add(errorhandling.ApiExceptionMapper.class);
        resources.add(errorhandling.GenericExceptionMapper.class);
        resources.add(org.glassfish.jersey.server.wadl.internal.WadlResource.class);
        resources.add(rest.FriendResource.class);
        resources.add(rest.MessageResource.class);
        resources.add(rest.UserResource.class);
        resources.add(security.AuthenticationEndpoint.class);
        resources.add(security.JWTAuthenticationFilter.class);
        resources.add(security.RolesAllowedFilter.class);
        resources.add(security.errorhandling.AuthenticationExceptionMapper.class);
    }
    
}
