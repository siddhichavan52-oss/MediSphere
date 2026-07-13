class Solution {
    public boolean isPalindrome(int x) {
        if(x<0)
        {
            return false;
        }
        int n=x;
        int ans=0,num;
        while(n!=0)
        {
            num=n%10;
            ans=(ans*10)+num;
            n=n/10;
        }
        if(ans==x)
        {
            return true;
        }
        return false;
    }
}

class Palindrome
{
    public static void main(String[] args) 
    {
        Solution obj1=new Solution();
        System.out.println(obj1.isPalindrome(121));
    }
}