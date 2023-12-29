<template>
  <VCard title="state management">
    <v-card-text>
      <h1>store</h1>
      <p>The application state manager, Pinia, defines the following property.</p>
      <P><b>token :</b>The user token is granted upon a successful login to the system.
      </P>
      <P><b>userInfo : </b>All user information, including name, family name, personal code, and more, is stored within this property.</P>
      <P><b>workspace : </b>Information about all workspaces that the user has joined.</P>
      <P><b>permits :</b>This property stores all the permissions granted to the user.
      </P>
      <P><b>WID :</b>This property serves the purpose of storing the ID of the current workspace that the user has selected from the top application navigation bar. It is extensively utilized in project API requests.
      </P>
      <P><b>productInTerm :</b>This property serves the purpose of storing and providing access to the names of all products that the user has purchased.</P>
      <P><b>activePlugins :</b>Some spatial features, such as Excel output, are available as plugins that need to be activated by the administrator. This property keep all active plugins .
      </P>
      <P><b>isAppReady :</b>This property is utilized to toggle the visibility of a splash screen while retrieving user information from the server.
      </P>
      <P><b>resetIdentityData :</b>This property is utilized to toggle the visibility of a splash screen while retrieving user information from the server.
      </P>
      <P><b>timer :</b>This property is used for monitoring the duration of a working employee. The duration consists of <b>seconds</b>, <b>minutes</b>, <b>hours</b>, and a boolean property called <b>"isRunning"</b> which indicates whether the timer is currently running or not.

        Additionally, this code includes three methods to control the timer:<br/>
      <div class="tw-ml-4">
      <b>start():</b> This method starts the timer and begins counting the duration. It sets the "isRunning" property to true.<br/>

      <b>pause():</b> This method pauses the timer. It stops the counting of duration and sets the "isRunning" property to false.<br/>

      <b>reset():</b> This method resets the timer and sets the duration back to zero. It also sets the "isRunning" property to false.<br/>
      </div>


        By utilizing these properties and methods, this code provides a simple way to monitor the working employee's duration and control the timer as needed.
      </P>

    </v-card-text>
  </VCard>
</template>

<script>
export default {
  name: 'store',
}
</script>

<style scoped>

</style>
